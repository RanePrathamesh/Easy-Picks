"use client"
import React from 'react'
import Link from 'next/link'
import { collectCategoryClickData } from '@/services/interactivityService'

export default function Categorycard({category}) {
    async function categoryClicked(categoryId){
        await collectCategoryClickData({categoryId})
    }
  return (
    <div key={category._id} className="category-item" onClick={()=>categoryClicked(category._id)}>
    <Link
      href="/[category]/products"
      as={`/${category.categoryName}/products`}
    >
      <h2 className="btn p-3 text-sm">{category.categoryName}</h2>
    </Link>
  </div>
  )
}
