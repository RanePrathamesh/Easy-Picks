'use client'
import { Fragment } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { deleteProduct, getProducts, scrapeProduct } from "@/services/productService";
import Loader from "@/components/common/Loader";
import { toast } from "react-toastify";
import { tosterProps } from "@/utils/generic-util";
import { getCategories } from "@/services/categoryService";

import Select from 'react-select';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import PaginatedItems from "@/components/pagination/Pagination";
import Image from "next/image";
import { scrapeAndSaveProduct } from "@/app/lib/Actions/index"


const Products = () => {
    const [products, setProducts] = useState([])
    const [catergoryData, setCatergoryData] = useState([])
    const [searchParams, setSearchParams] = useState("")
    const [status, setStatus] = useState(false)
    const [page, setPage] = useState(1)
    const [filter, setFilter] = useState({})
    const [prodCount, setProdCount] = useState(0)
    const [showModel, setShowModel] = useState(false)
    const [addproductData, setAddProductData] = useState({})


    // product pagination and search and filter-----------------
    useEffect(() => {
        async function fetchData() {
            setStatus(false)
            filter.page = page
            filter.keyword = searchParams
            const response = await getProducts(filter);
            setProdCount(response.prodCount)
            setProducts(response.products);
            setStatus(response.success);
        }
        fetchData();
    }, [page, searchParams]);

    async function filterProductByCategory(selectedOption) {
        setStatus(false)
        filter.page = 1
        if (selectedOption.value) {
            filter.category = selectedOption.value
        } else {
            delete (filter.category)
        }
        const response = await getProducts(filter);
        setProducts(response.products);
        setStatus(response.success);
        setProdCount(response.prodCount)
    }
    // product pagination and search and filter-----------------

    // get category----------------------------------
    useEffect(() => {
        async function fetchData() {
            let { categories } = await getCategories();
            categories = categories.map(obj => {
                return JSON.stringify({
                    id: obj._id,
                    name: obj.categoryName
                })
            });
            setCatergoryData(categories);
        }
        fetchData();
    }, []);

    function categoryOptions() {
        let categories = catergoryData.map(obj => {
            obj = JSON.parse(obj);
            return {
                value: obj.id,
                label: obj.name,
            }
        });
        categories.unshift({
            label: "Select All",
            value: null
        })
        return categories
    }
    // get category----------------------------------

    // product delete and scrape---------------------------------
    async function handleDelete(id) {
        let response = await deleteProduct(id)
        let filteredProducts = products.filter(product => product._id !== id);
        setProducts(filteredProducts)
        if (response.success) {
            toast.success(response.message, tosterProps)
        } else {
            toast.error(response.message, tosterProps)
        }
    }
    async function handleScrape(id) {
        let response = await scrapeProduct(id)
        const data = await getProducts(filter);
        setProducts(data.products);
        if (response.success) {
            toast.success(response.message, tosterProps)
        } else {
            toast.error(response.message, tosterProps)
        }
    }
    // product delete and scrape^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    function handleAddProduct(e) {
        if (e.target?.name === "url") {
            setAddProductData({ ...addproductData, url: e.target.value })
        } else {
            setAddProductData({ ...addproductData, category: e.value })
        }
    }

    async function addProduct(e) {
        e.preventDefault()
        const response = await scrapeAndSaveProduct(addproductData);
        if (!response.success) {
            return toast.error("Error adding product", tosterProps)
        }
        if(response.isExist){
            return toast.success("This Product is Already exist", tosterProps)
        }else{
            return toast.success("Product Added Successfully!", tosterProps)
        }
    }

    return (
        <>
            <div className={`${!showModel && "hidden"} z-9 w-2/3 bg-white mx-auto border p-8 absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]`}>
                <FontAwesomeIcon className="absolute right-4 top-4" icon={faXmark} beat size="xl" onClick={() => setShowModel(false)} />
                <h2 className="mb-6 border-b-2 pb-2 border-solid border-gray-1">Add Product</h2>
                <form className="flex-col" onSubmit={addProduct}>
                    <div>
                        <label>Product Url</label>
                        <input name="url" onChange={handleAddProduct} className="my-2 mx-auto bg-gray-50 w-[97%]  font-medium text-black text-opacity-80 text-sm rounded-md border-[1px] border-gray-1 block p-2" type="text" placeholder="Enter Product Url" />
                    </div>
                    <div>
                        <label>Select category</label>
                        <Select
                            name="category"
                            id="category"
                            className="bg-gray-50  font-medium border-gray-300 text-black text-opacity-80 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            options={categoryOptions()}
                            onChange={handleAddProduct}
                        />
                    </div>
                    <button type="submit" className="border px-8 py-2 borde rounded-lg bg-primary bg-opacity-80 text-white">Add</button>
                </form>
            </div>



            <h3>Filters</h3>
            <div className="flex items-center gap-3">
                <div className="w-1/3">
                    <Select
                        id="category"
                        className="bg-gray-50  font-medium border-gray-300 text-black-2 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        options={categoryOptions()}
                        onChange={filterProductByCategory}
                    />
                </div>
                
                <div className="w-1/10">
                    <button className="border px-8 py-2 borde rounded-lg bg-primary bg-opacity-80 text-white" onClick={() => setShowModel(true)}>Add Product</button>
                </div>
            </div>
            <h3 className="font-semibold text-black">No of products( {products?.length} )</h3>
            {
                products?.length ?
                    <Fragment>
                        <div className={`w-full ${showModel && "filter blur-sm fixed"}`}>
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-100" >
                                        <th className="py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                                        <th className="py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                                        <th className="py-3 text-center font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {
                                        products && (products.map((product, i) => {
                                            return (
                                                <tr key={product._id} >
                                                    <td className="py-1 w-2/3">
                                                        <div className="flex items-center gap-8">
                                                            <Image src={`/images/products/${product.productID}/mainImage.webp`} alt="product-img" width={80}
                                                                height={80} />
                                                            <span className="pr-4">{product.title}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-1 text-black">{product?.category?.categoryName}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex space-x-2 justify-center">
                                                            <button className="text-black bg-opacity-70 bg-meta-6 px-2 py-1 rounded" ><Link href={{
                                                                pathname: `/admin/products/edit/${product._id}`,
                                                                // query: { catergoryData }
                                                            }}>Edit</Link></button>
                                                            <button onClick={() => handleDelete(product._id)} className="text-white bg-opacity-80 bg-meta-1 px-2 py-1 rounded">Delete</button>
                                                            <button onClick={() => handleScrape(product._id)} className="text-white bg-opacity-80 bg-primary px-2 py-1 rounded">Scrape</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        }))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Fragment> : status ? (
                        <>
                            <h1 className="flex justify-center font-bold text-warning text-3xl">No Products Found.......</h1>
                        </>
                    ) : <Loader />
            }
            <div className={`w-full ${showModel && "bottom-0 filter blur-sm fixed"}`}>
                <PaginatedItems setPage={setPage} itemsCount={prodCount} itemsPerPage={20} />
            </div>
        </>
    );
};

export default Products;
