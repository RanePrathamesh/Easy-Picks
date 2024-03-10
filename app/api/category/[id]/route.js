import Category from "@/models/category";
import { connectToDB } from "@/utils/db";
import Product from '@/models/product';

export const GET = async (req, { params }) => {
  await connectToDB();

  try {
    if (params.id) {
      const category = await Category.findById(params.id)
        .populate('parentCategory', 'categoryName') 
        .exec();

      if (!category) {
        return new Response(`Category not found`, { status: 404 });
      }

      const productCount = await Product.countDocuments({ category: params.id });
      const categoryWithCount = {
        _id: category._id,
        categoryName: category.categoryName,
        parentCategory: category.parentCategory
          ? category.parentCategory.categoryName 
          : null, 
        productCount,
      };
      return new Response(JSON.stringify(categoryWithCount), { status: 200 });
    }

    return new Response(`Category not found`, { status: 404 });
  } catch (error) {
    return new Response(`Failed to fetch categories: ${error}`, { status: 500 });
  }
};


export const PUT = async (req, { params}) => {
    await connectToDB();
  const { name, parent } = await req.json();

    try {
      if (params.id) {
        // console.log(parent);
        const category = await Category.findById(params.id);
        if (!category) {
          return new Response(`Category not found`, { status: 404 });
        }
        category.categoryName = name; 
        category.parentCategory = parent

  
        await category.save();
  
        return new Response(`Category updated`, { status: 200 });
      }
  
      return new Response(`Category not found`, { status: 404 });
    } catch (error) {
      return new Response(`Failed to update category: ${error}`, { status: 500 });
    }
  };