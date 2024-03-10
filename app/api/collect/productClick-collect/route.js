import Collect from "@/models/collect";
import { NextResponse } from "next/server";

export async function POST(req) {
    let { body } = await req.json();
    let visitData = {};
    visitData.productId = body.productId;
    visitData.productPageUrl = body.pathName;
    visitData.index = [{
        position: body.position,
        filter: body.filter,
        clickTime: new Date
    }];

    if (!body.visitId) {
        return NextResponse.json({
            message: `No visit data found`
        })
    }
    try {
        const collectData = await Collect.findOne({ visitId: body.visitId });

        const productAlreadyVisited = collectData.productClicked.findIndex(
            (product) => product.productId.toString() === visitData.productId
        );
        if (productAlreadyVisited !== -1) {
            collectData.productClicked[productAlreadyVisited].index.push(visitData.index[0])
            collectData.productClicked[productAlreadyVisited].productPageUrl = visitData.productPageUrl;
        } else {
            collectData.productClicked.push(visitData)
        }
        await collectData.save();
        return NextResponse.json({
            message: `user with ip ${visitData.ip} visited`
        })
    } catch (error) {
        return NextResponse.json({
            message: `some thing went wrong : ${error.message}`
        })
    }
   
}