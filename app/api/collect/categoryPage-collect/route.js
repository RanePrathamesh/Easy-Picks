import { NextResponse } from "next/server";
import Collect from "@/models/collect";

export async function POST(req){
    const { body } = await req.json();
    const { visitId, currentUrl } = JSON.parse(body);
    const userIp = req.headers.get("x-forwarded-for");
    if (!(visitId && userIp)) {
        return NextResponse.json({
            message: "can't find visitId",
            success: false
        })
    }
    const collectPayload = {
        visitId,
        visitpages: [{
            route:currentUrl,
            noOfVisit:1
        }],
        visiterIp: userIp,
    }
    try {
        const alreadyCollected = await Collect.findOne({ visitId });
        if (!alreadyCollected) {
            const collect = await Collect.create(collectPayload);
            return NextResponse.json({
                collect,
                success: true
            })
        }

        let routeIncludes=false;
        alreadyCollected?.visitpages.forEach(page => {
            if(page.route===currentUrl){
                routeIncludes=true
                page.noOfVisit++
            }
        });
        console.log(routeIncludes)
        if(!routeIncludes){
            alreadyCollected.visitpages.push({
                route:currentUrl,
                noOfVisit:1
            })
        }
        await alreadyCollected.save()
        return NextResponse.json({
            message: "Data is Already Collected",
            success: true
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            message: error.message,
            success: false
        })
    }
}