import Category from "@/models/category";
import Product from "@/models/product";
import { ApiFeature } from "@/utils/apiFeatures";
import { connectToDB } from "@/utils/db";
import { NextResponse } from "next/server";

await connectToDB();

export const POST = async (req) => {
  const { categoryName, categoryType, subCategoryOf, categoryLink, categoryKeywords } = await req.json();
  try {
    if (!categoryName || !categoryType) {
      throw new Error("Category name and type are required.");
    }
    if(categoryType==="Amazon"){
      const newCategory = new Category({
        categoryName,
        categoryType,
        categoryLink,
        parentCategory: subCategoryOf
      });
      const savedCategory = await newCategory.save();
      return new Response(JSON.stringify(savedCategory), { status: 201 });
    } else if(categoryType==="Custom"){
      const newCategory = new Category({
        categoryName,
        categoryType,
        categoryLink: `https://www.amazon.in/s?k=${categoryKeywords? categoryKeywords : categoryName}`,
        parentCategory: subCategoryOf
      });
      
      const savedCategory = await newCategory.save();
      return new Response(JSON.stringify(savedCategory), { status: 201 });
    }
  } catch (error) {
    console.log(error)
    return new Response(`Failed to create a new category ${error}`, { status: 500 });
  }
};


export const GET = async (request) => {
  const url = new URL(request.url);
  const queryObj = Object.fromEntries(url.searchParams);
  try {
    const apiFeature=new ApiFeature(Category.find().populate('parentCategory', 'categoryName'),queryObj).searchCategory().pagination(20);
    
    const apiFeature2=new ApiFeature(Category.find().populate('parentCategory', 'categoryName'),queryObj).searchCategory();

    const categories=await apiFeature.query
    const categoryCount=await apiFeature2.query.countDocuments();

    const populatedCategories = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({ category: category._id });
        const parentCategoryName = category.parentCategory ? category.parentCategory.categoryName : '';

        const categoryWithCount = {
          _id: category._id,
          status: category.status,
          categoryLink: category.categoryLink,
          categoryName: category.categoryName,
          parentCategory: parentCategoryName,
          productCount,
        };

        return categoryWithCount;
      })
    );

    // return new Response(JSON.stringify(populatedCategories), { status: 200 });
    return NextResponse.json({
      populatedCategories,
      categoryCount,
      success:true
    })
  } catch (error) {
    return NextResponse.json({
      message:`Failed to fetch categories: ${error.message}`,
      success:false
    })
  }
};


export const DELETE = async (req) => {
  try {
    const { _id } = await req.json(); // Ensure that _id is being sent in the request body
    // console.log(_id);
    // console.log(req.body._id);

    if (!_id) {
      // Handle the case where _id is not provided
      return new Response("No _id provided", { status: 400 });
    }
    // Find the Category by ID and remove it
    await Category.findByIdAndRemove(_id); // Provide the ID to remove

    return new Response("Category deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Error deleting Category", { status: 500 });
  }
};
