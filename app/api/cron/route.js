import { NextResponse } from "next/server";
import Category from "@/models/category"
import { CronJob } from 'cron';
import { connectToDB } from "@/utils/db";
import Cron from "@/models/cronTask";
import { saveProductsOfXCategory } from "@/methods";
import puppeteer from "puppeteer";
import { ExtractProductLiknsAndExecute } from "@/app/lib/Scraper/scrapers";
import { GlobalRef } from "@/app/lib/globalRef";

const cronRef=new GlobalRef("cron-ref");
const abortScrapingRef=new GlobalRef("abort-scraping-ref");
const CRON_MAP=cronRef.value;
export async function GET() {
    try {
        const crons = await Cron.find({})
        if (crons.length) {
            return NextResponse.json({
                crons,
                success: true
            })
        }
        throw new Error("No cron job Scheduled")
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: error.message || "Error while fetching cron data",
            success: false
        })
    }
}


export async function POST(req) {
    const {_id, cronType, cronPattern, cronDescription, cronStatus, limit } = await req.json();
    try {
        connectToDB();
        let cronId;
        if(!_id){
            const { _id} = await Cron.create({ cronType, cronPattern, cronDescription, cronStatus })
            cronId = _id;
        }else{
            cronId=_id
        }

        const cronTask = new CronJob(
            cronPattern,
            async function () {
                await executeCategories(cronId, limit);
            },
            null,
            false,
            'Asia/Kolkata'
        );
        CRON_MAP.set(cronId?.toString(), cronTask);
        const addedCron = CRON_MAP.get(cronId?.toString())
        if (cronStatus === "active" && addedCron) {
            cronTask.start()
            return NextResponse.json({
                message: `cron set succesfully for : ${cronDescription}`,
                success: true
            })
        }
        return NextResponse.json({
            message: `failed for Scheduling : ${cronDescription}`,
            success: false
        })
    }
    catch (error) {
        console.log(error)
        return NextResponse.json({
            message: `Error while scheduling : cron`,
            success: false,
        })
    }
}

export async function PUT(req) {
    try {
        connectToDB();
        const idQuery = req.nextUrl.searchParams?.get('id');
        if (idQuery) {
            let cron = await Cron.findById(idQuery);
            const addedCronJob = CRON_MAP.get(idQuery);
            if (cron && addedCronJob) {
                if (cron.cronStatus === "active") {
                    cron.cronStatus = "paused"
                    addedCronJob.stop()
                    cron.save()
                    return NextResponse.json({
                        message: "cron status toggled",
                        success: true
                    })
                }
                addedCronJob.start();
                cron.cronStatus = "active"
                cron.save()
                return NextResponse.json({
                    message: "cron status toggled",
                    success: true
                })
            }
            return NextResponse.json({
                message: "Error while changing status",
                success: false
            })
        }
        const { cronStatus, id, cronPattern, description } = await req.json();
        let cron = await Cron.findById(id)
        const addedCronJob = CRON_MAP.get(id);
        if (cron && addedCronJob)
            cron.cronStatus = cronStatus
        cron.cronPattern = cronPattern
        cron.description = description
        await cron.save()
        return NextResponse.json({
            message: "cron status paused ,stoping.. cron",
            success: true
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            message: "Error updating cron schedule",
            success: false
        })
    }
}

export async function DELETE(req) {
    const id = req.nextUrl.searchParams.get('id')
    try {
        connectToDB();
        let cron = await Cron.findById(id)
        let addedCronJob = CRON_MAP.get(id);
        if (cron && addedCronJob) {
            addedCronJob.stop()
            addedCronJob = null;
            await Cron.findByIdAndDelete(id)
            CRON_MAP.delete(id);
            return NextResponse.json({
                message: "cron deleted successfully!",
                success: true
            })
        } else {
            return NextResponse.json({
                message: "Error deleting cron schedule1",
                success: false
            })
        }
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({
            message: "Error deleting cron schedule",
            success: false
        })
    }
}



export async function executeCategories(id, limit) {
    abortScrapingRef.value=false
    try {
        const categoryLinks = await Category.find().select("categoryLink")//will change in future
        if (!categoryLinks) {
            if (CRON_MAP.has(id)) {
                let existCronTask = cronTask.get(id);
                existCronTask.stop();
                await Cron.updateOne({ _id: id }, { $set: { cronStatus: "paused", pauseResone: "No category link available" } })
            }
        }
        for (const categoryLink of categoryLinks) {
            const abortScrapingRef=new GlobalRef("abort-scraping-ref");
            if(abortScrapingRef.value){
                console.log("\x1b[31m FORCE  STOPING CATEGORY SCRAPING......");
                break;
            }
            const browser = await puppeteer.launch({ headless: false });
            const newPage = await browser.newPage();
            let products = await ExtractProductLiknsAndExecute(browser, newPage, categoryLink.categoryLink);
            await saveProductsOfXCategory(products, categoryLink._id)
        }
    } catch (error) {
        console.log("error " + error)
    }

}