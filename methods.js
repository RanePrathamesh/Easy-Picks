import Product from "@/models/product";
import { connectToDB } from "@/utils/db";
import Category from "./models/category";
import { OpenAI } from "openai";
const mongoose = require('mongoose');
import axios from "axios";

export const sortProducts = (products) => {
  const maxSoldInLastMonth = Math.max(
    ...products.map((product) => product?.soldInPastMonth || 0)
  ) || 1;
  const maxPriceToPay = Math.max(
    ...products.map((product) => product?.priceToPay || 0)
  ) || 1;
  const maxReviewCount = Math.max(
    ...products.map((product) => product?.reviewCount || 0)
  ) || 1;

  const weightSoldInLastMonth = 0.9;
  const weightRating = 0.7;
  const weightPriceToPay = 0.6;
  const weightReviewCount = 0.2;

  products.forEach((product) => {
    if(! products) return;
    const normalizedRating = product?.rating !== undefined ? product?.rating / 5 : 0;
    const normalizedSoldInLastMonth =
      product?.soldInPastMonth !== undefined ? product?.soldInPastMonth / maxSoldInLastMonth : 0;
    const normalizedPriceToPay = product?.priceToPay !== undefined ? product?.priceToPay / maxPriceToPay : 0;
    const normalizedReviewCount = product?.reviewCount !== undefined ? product?.reviewCount / maxReviewCount : 0;

    product.compositeScore =
      weightRating * normalizedRating +
      weightSoldInLastMonth * normalizedSoldInLastMonth -
      weightPriceToPay * normalizedPriceToPay +
      weightReviewCount * normalizedReviewCount;
  });

  const maxCompositeScore = Math.max(...products.map((product) => product.compositeScore));
  const minCompositeScore = Math.min(...products.map((product) => product.compositeScore));

  const minRating = 8;
  const maxRating = 9.9;

  products.forEach((product) => {
    const denominator = maxCompositeScore - minCompositeScore;
    const normalizedScore = denominator !== 0 ? (product.compositeScore - minCompositeScore) / denominator : 0;

    product.personalizedRating = parseFloat((normalizedScore * (maxRating - minRating) + minRating).toFixed(1));
  });
  return products
};


export const saveProductsOfXCategory = async (scrapedProducts, categoryID) => {
  scrapedProducts=scrapedProducts.filter(product =>product!==null)
  try {
    if (scrapedProducts && categoryID) {
      await connectToDB();
      const productsToInsert = [];
      scrapedProducts= sortProducts(scrapedProducts);
      for (const product of scrapedProducts) {
        if(!product) continue;
        try {
         const newproduct=await insertOrUpdateProduct(product, categoryID);
         if(!newproduct) continue;
         productsToInsert.push(newproduct);
        } catch (error) {
          console.log(error);
        }
      }
      if (productsToInsert.length > 0) {
        await Product.insertMany(productsToInsert);
        console.log(`${productsToInsert.length} products inserted.`);
      }
      // await bindChatgptReview(categoryID)
      // Update lastUpdated for the category
      await Category.findByIdAndUpdate(
        categoryID,
        { $set: { lastUpdated: new Date() } },
        { new: true }
      );

      console.log("All products processed.");
    }
  } catch (error) {
    console.error("Error saving products to the database:", error);
  }
};

export const askGPT = async (product) => {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `
    Note(there my be chances that any dynamic value will be empty)
    analyze and read All data give below:(give your personal opinion)
    This is product which has "Title" :${product.title} and "description" :${product.description} (if not description generate it using reviews pros points, just change it little bit) and here user review Array :  "reviews": ${product.reviews}
    (for reviews give those points priority which indicating same points)
    give results in javascript array:
    1)Array of product features 
    2)Array of pros
    3)Array of cons `;

    // const prompt = `I have this product called ${product.title}. ${product.description}. Can you provide a short summary in 5-7 points based on the product details and reviews? Here is some additional information about product: Review Count-${product.reviewCount}, SoldInPastMonth-${product.soldInPastMonth}`;

    // console.log(prompt);

    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: prompt },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 400,
    });

    const summary = completion.choices[0].message.content;
    console.log(summary);
    return summary

  } catch (error) {
    console.error('Error:', error.message);
  }
};

// const bindChatgptReview=async function (categoryID){
//   const topProducts =10
//   const sortedProducts=await Product.find({category: new mongoose.Types.ObjectId(categoryID)}).sort({ personalizedRating: -1 }).limit(topProducts);
//   for(const product of sortedProducts){
//    await askGPT(product)
//   }
// }


export const insertOrUpdateProduct = async function (product,categoryID) {
  if (!product?.priceToPay) {
    throw new Error(`Product ${product.productID} has No price value fix it!`)
  }
  const existingProduct = await Product.findOne({
    productID: product.productID,
  });

  if (existingProduct) {
    const fieldsToCheck = [
      'availability',
      'brand',
      'mainImageSrc',
      'mrp',
      'priceToPay',
      'rating',
      'replacementInfo',
      'reviewCount',
      'savingsPercentage',
      'seller',
      'soldInPastMonth',
      'variants',
      'warrantyInfo',
      'personalizedRating',
      'reviews'
    ];
    for (const field of fieldsToCheck) {
      if (product[field] && (existingProduct[field] !== product[field])) {
        if(field === 'reviews' &&  (product[field].length < existingProduct[field].length)) {
         continue;
        }
      if(product[field])  existingProduct[field] = product[field];
      }
    }
    existingProduct.priceHistory = [
      ...existingProduct.priceHistory,
      {
        priceToPay: product.priceToPay,
        mrp: product.mrp
      }
    ]
    existingProduct.reviews = product.reviews
    await existingProduct.save();
    console.log(`Product of Id ${product.productID} updated`);
    return;
  }
  else {
    // Product does not exist, insert it
    const newProduct = new Product({
      productID: product.productID,
      title: product.title,
      availability: product.availability || "Not available",
      brand: product.brand || "Unknown brand",
      description: product.description || "No description available",
      mainImageSrc: `/${product.productID}/mainImage.webp`,
      savingsPercentage: product.savingsPercentage,
      priceToPay: product.priceToPay,
      mrp: product.mrp,
      rating: product.rating,
      reviewCount: product.reviewCount,
      warrantyInfo: product.warrantyInfo,
      replacementInfo: product.replacementInfo,
      seller: product.seller,
      url: product.url,
      soldInPastMonth: product.soldInPastMonth,
      variants: product.variants,
      category: categoryID,
      reviews: product.reviews,
      personalizedRating:product.personalizedRating
    });
    return newProduct
  }
}
