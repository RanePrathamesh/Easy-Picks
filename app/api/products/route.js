import Product from "@/models/product";
import Category from "@/models/category";
import { connectToDB } from "@/utils/db";
import { NextResponse } from "next/server";
import { ApiFeature } from "@/utils/apiFeatures";


connectToDB()
export async function GET(request) {
    const url = new URL(request.url);
    const queryObj = Object.fromEntries(url.searchParams);
    try {
        const productPerPage = 20
        let apiFeature = new ApiFeature(Product.find().populate({
            path: 'category',
            select: 'categoryName'
          }), queryObj).search().filter().pagination(productPerPage)

          let apiFeature2 = new ApiFeature(Product.find(), queryObj).search().filter()

          const prodCount=await apiFeature2.query.countDocuments()
        let products = await apiFeature.query;
        return NextResponse.json({
            products,
            success: true,
            prodCount
        })
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({
            message: error.message,
            success: false
        })
    }
}