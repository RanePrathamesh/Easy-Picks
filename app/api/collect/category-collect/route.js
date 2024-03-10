import { NextResponse } from "next/server";

export async function POST(req){
    let {body}=await req.json();
    let visitData={};
    visitData.timeStamp = Date.now();
    visitData.ip=req.headers.get("x-forwarded-for")
    visitData.categoryId=body.categoryId;
    visitData.pathName=body.pathName;
    visitData.index={
        position:body.position,
        filter:body.filter
    };
    console.log(visitData)
    return NextResponse.json({
        message:`user with ip ${visitData.ip} visited`
    })
}