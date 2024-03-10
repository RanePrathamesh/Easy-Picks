import Product from "@/models/product";
import { connectToDB } from "@/utils/db";
import { NextResponse } from "next/server";

connectToDB()


// update product 
export async function PUT(request, { params }) {
    let productId = await params.productId;
    try {
        let product = await Product.findById(productId).select("-variants");
        if(!product) {
            throw new Error("No product found of given id")
        }
        const { title, description, categoryId } =await request.json();
        product.title = title;
        product.description = description;
        product.category = categoryId;
        const updatedProduct = await product.save();
        return NextResponse.json({
            updatedProduct,
            success: true
        })
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            message: error.message,
            success: false
        });
    }
}


// delete product 
export async function DELETE(request, { params }) {
    let productId = await params.productId;
    try {
        let product = await Product.findById(productId).select("-variants");
        if(!product||!Array.isArray(product)&&product.length) {
            throw new Error("No product found of given id")
        }
        await Product.deleteOne({_id:productId})
        return NextResponse.json({
            message:`product of id : ${productId} deleted successfully!!`,
            success: true
        })
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            message: error.message,
            success: false
        });
    }
}

// get product details
export async function GET(request, { params }) {
    let productId = await params.productId;
    try {
        let product = await Product.findById(productId).select("-variants").populate({
            path: 'category',
            select: 'categoryName'
          });
        if(!product||!Array.isArray(product)&&product.length) {
            throw new Error("No product found of given id")
        }
        return NextResponse.json({
            product,
            success: true
        })
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            message: error.message,
            success: false
        });
    }
}