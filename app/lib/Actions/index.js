"use server"
import Product from "@/models/product";
import mongoose from "mongoose";
import { createBrowserAndPage, scrapeSingleProduct } from "../Scraper/scrapers";
import { insertOrUpdateProduct } from "@/methods";




export async function scrapeAndSaveProduct(productDetails) {
    if (!productDetails) return;
    try {
        const chromium = await createBrowserAndPage()
        const product = await scrapeSingleProduct(productDetails.url, chromium.newPage);
        if (!product || !product.title) return { isExist: false, sucess: false };
        product.category = productDetails.category
    
        const categoryObjectId = new mongoose.Types.ObjectId(product.category);
        const isExitingProduct = await Product.findOne({ productID: product.productID, category: categoryObjectId });
        if (isExitingProduct) return { isExist: true, success: true }
        const productsToInsert = [];
        await insertOrUpdateProduct(product, productDetails.category, productsToInsert)
        if (productsToInsert.length > 0) {
            await Product.insertMany(productsToInsert);
            console.log(`${productsToInsert.length} products inserted.`);
        }
        return { isExist: false, success: true };
    } catch (error) {
        console.log(error)
    }
}

