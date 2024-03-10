import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import Collect from '@/models/collect';

export async function GET(req, res) {
    const visitId = uuidv4();
    const response = NextResponse.json({
        sucess: true,
        visitId
    });
    return response
}

export async function POST(req, res) {
    const { body } = await req.json();
    const { visitId, currentUrl } = JSON.parse(body);
    const userIp = req.headers.get("x-forwarded-for");
    if (!(visitId && userIp)) {
        return NextResponse.json({
            message: "can't find visitId",
            success: false
        })
    }

    try {
        const alreadyCollected = await Collect.findOne({ visitId });
        if (!alreadyCollected) {
            const collectPayload = {
                visitId,
                visitpages: [{
                    route: currentUrl,
                    noOfVisit: 1
                }],
                visiterIp: userIp,
            }
            const collect = await Collect.create(collectPayload);
            return NextResponse.json({
                collect,
                success: true
            })
        }
        let routeIncludes = false;
        alreadyCollected?.visitpages.forEach(page => {
            if (page.route === currentUrl) {
                routeIncludes = true
                page.noOfVisit++
            }
        });
        if (!routeIncludes) {
            alreadyCollected.visitpages.push({
                route: currentUrl,
                noOfVisit: 1
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