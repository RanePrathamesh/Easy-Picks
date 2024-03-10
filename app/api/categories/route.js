import NextJsResponse from "@/app/lib/NextResponse";
import Category from "@/models/category";
import { connectToDB } from "@/utils/db";
import { NextResponse } from "next/server";


export async function GET(){
    connectToDB()
    try {
        let categories=await Category.find();     
       return NextResponse.json({
            categories,
            success: true,
        })
    } catch (error) {
        console.log("Error "+ error);
      return  NextResponse.json({
            message: error.message,
            success: false
        })
    }
}
export async function DELETE(res){
    connectToDB()
    const {_id:cid}=await res.json();
    try {
        await Category.findByIdAndDelete(cid); 
        return NextJsResponse({success: true, message:`category ${cid} deleted successfully`})  
    } catch (error) {
        console.log(error);
        return NextJsResponse({success: false, message:`Error deleting category ${cid}`})
    }
}