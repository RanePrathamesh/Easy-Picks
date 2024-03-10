import { NextResponse  } from "next/server"

export default function NextJsResponse({success,message,data={}},{code,text}=""){
   const statusObj={}
    if(code) statusObj.status=code
    if(text) statusObj.statusText=text
    return NextResponse.json({
        success:success,
        message:message,
        data
    },statusObj)
}