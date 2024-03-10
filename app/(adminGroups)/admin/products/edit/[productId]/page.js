'use client'
import Loader from '@/components/common/Loader'
import { getProductDetails, updateProduct } from '@/services/productService'
import { tosterProps } from '@/utils/generic-util'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import SelectCategory from './selectOptions';
import Image from 'next/image'

export default function page({ params }) {
  const searchParams = useSearchParams();
  const router = useRouter()
  const [product, setProduct] = useState([])
  const [category, setCategory] = useState([])
  const [loding, setLoading] = useState(false);
  const { productId } = params
  useEffect(() => {
    async function fetchData() {
      const response = await getProductDetails(productId);
      setProduct(response.product)
    }
    fetchData();
    let categoryData = searchParams.getAll("catergoryData");
    categoryData = categoryData.map((category) => JSON.parse(category));
    setCategory(categoryData)
  }, [])


  async function handleProductUpdate(e) {
    setLoading(true)
    e.preventDefault();
    let updatePayload = {
      title: product.title,
      description: product.description,
      productId: product?._id,
      category: product?.category?._id
    }
    const response = await updateProduct(updatePayload)
    setLoading(false)
    if (response.success) {
      // router.back();
      toast.success("Product Details Updated", tosterProps);
    } else {
      toast.error(response.message, tosterProps);
    }
  }
  return (
    <>
      {
        loding ? <Loader /> :
          <div className="w-full ">
            <h2 className='mx-auto text-center pb-2 border-b !border-slate-400  w-2/5 font-bold'>Product :{product?._id}</h2>

            <div className=' flex items-center mt-6 gap-3'>
              <div className='h-full w-0.8/3'>
                <Image src={`/${product?.productID}/mainImage.webp`} alt="product-img" className='h-100 w-full' width={225} height={300} />
              </div>
              <div className='p-4 w-2/3 '>
                <form onSubmit={handleProductUpdate}>
                  <div className="mb-6 w-full">
                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                    <textarea id="title" rows="3" className="block p-2.5 w-full text-sm text-black bg-gray-50 font-medium rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={product?.title}
                      onChange={(e) => setProduct({ ...product, title: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="mb-6 w-full">
                    <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Content</label>
                    <textarea id="content" rows="10" className="block p-2.5 w-full text-sm text-black bg-gray-50 font-medium rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={product?.description} onChange={(e) => setProduct({ ...product, description: e.target.value })}></textarea>
                  </div>

                  {/* <SelectCategory product={product} category={category} setProduct={setProduct}/> */}

                  <button type="submit" className="bg-primary text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>

                  <Link href="/admin/products" className="bg-warning text-white hover:bg-blue-800 focus:ring-4 focus:outline-none ml-3 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Go to Product Page</Link>
                </form>

              </div>
            </div>
          </div>
      }
    </>

  )
}
