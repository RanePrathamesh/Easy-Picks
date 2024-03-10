// pages/api/search.js

import Category from '@/models/category';
import Product from '@/models/product';
import { NextResponse } from 'next/server';

export async function GET(req, res) {
  const url = new URL(req.url);
  const queryObj = Object.fromEntries(url.searchParams);
  const { searchValue, page = 1, perPage = 10 } = queryObj;

  try {
    if (searchValue) {
      const categoryDocs = await Category.find({
        categoryName: { $regex: searchValue, $options: 'i' },
      });

      const totalProductCount = await Product.countDocuments({
        title: { $regex: searchValue, $options: 'i' },
      });

      const productDocs = await Product.find({
        title: { $regex: searchValue, $options: 'i' },
      })
        .skip((page - 1) * perPage)
        .limit(perPage);

      return NextResponse.json({
        status: 200,
        body: {
          categories: JSON.parse(JSON.stringify(categoryDocs)),
          products: JSON.parse(JSON.stringify(productDocs)),
          totalProductCount,
        },
      });
    } else {
      return NextResponse.json({
        status: 200,
        body: {
          categories: [],
          products: [],
          totalProductCount: 0,
        },
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      status: 500,
      body: {
        error: 'Internal Server Error',
      },
    });
  }
}
