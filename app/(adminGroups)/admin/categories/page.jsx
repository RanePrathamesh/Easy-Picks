"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";
import { categoriesWithProdCount } from "@/services/categoryService";

import PaginatedItems from "@/components/pagination/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faArrowsRotate, faTrash, faLink } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { GlobalRef } from "@/app/lib/globalRef";
import Confirmation from "@/components/modals/confirmation/Confirmation";
import axios from "axios";


const CategoriesPage = () => {
  const itemsPerPage = 20
  const [allCategories, setAllCategories] = useState([]);
  const [abortScrapingRef, setAbortScrapingRef] = useState(new GlobalRef("abort-scraping-ref"));
  const [searchParams, setSearchParams] = useState("")
  const [count, setCount] = useState(false)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState({})
  const [loading, setLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [currentCategory, setCurrentCategory] = useState("")


  const router = useRouter();

  const scrape = async (category) => {
    toast.warning("Scraping of category: " + category.categoryName + " started !");
    const link = category.categoryLink;
    try {
      const { data } = await axios.put(`/api/scrape?link=${link}&categoryID=${category._id}`)
      if (!data.success) return toast.error("Error changing status");
      setLoading(true)
      let response = await fetch(
        `/api/scrape?link=${link}&categoryID=${category._id}`
      );
      setLoading(false)
      response = await response.json()
      if (response.success) {
        toast.success("Category " + category.categoryName + " scrape completed")
      } else {
        toast.error("Error! scraping " + category.categoryName + response?.message)
      }
    } catch (error) {
      setLoading(false)
      console.error("Error during scraping:", error);
      toast.error("Error! scraping " + category.categoryName + res.message)
    }
  };

  const handleEdit = async (category) => {
    router.push(`categories/edit/${category._id}`);
  };

  const visitCategory = async (category) => {
    const { _id } = category;
    if (_id) {
      const newWindow = window.open(`/${_id}/products`, "_blank");
      if (newWindow) {
        newWindow.opener = null;
      }
    }
  };

  async function handleDelete (category) {
       try {
   let response=  await fetch(`/api/categories`, {
        method: "DELETE",
        body: JSON.stringify({ _id: category._id }),
      });
      setDeleteModal(false)
      const filteredCategories = allCategories.filter(
        (item) => item._id !== category._id
      );
      setAllCategories(filteredCategories);
    } catch (error) {
      setDeleteModal(true)
      console.log(error);
    }
  };

  const showDeleteModel = async (category) => {
    setDeleteModal(true);
    setCurrentCategory(category);
  }

  function changeRef() {
    setAbortScrapingRef(prev => ({ ...prev, value: true }))
  }

  useEffect(() => {
    const fetchCategories = async () => {
      filter.page = page
      filter.keyword = searchParams
      const response = await categoriesWithProdCount(filter);
      setAllCategories(response.populatedCategories);
      setCount(response.categoryCount);
    };
    fetchCategories();
  }, [searchParams, page, loading]);

  return (
    <div>
      
      <div className="flex flex-col gap-10">
        <div className="flex space-x-4">
          <Link
            href="categories/add"
            className="inline-flex items-center rounded-md justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            Add Category
          </Link>
          
          
        </div>
        {allCategories.length > 0 ? (<div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <Confirmation isShow={deleteModal} setIsShow={setDeleteModal} externalMethod={handleDelete} argument={currentCategory}/>
          <h3 className="text-success font-semibold">Showing {page == 1 ? 1 : itemsPerPage * (page - 1) + 1} - {itemsPerPage * page > count ? count : itemsPerPage * page} of {count}</h3>

          <div className="py-6 px-4 md:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Top Categories
            </h4>
          </div>

          <div className="grid grid-cols-5 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-5 md:px-6 2xl:px-7.5">
            <div className="col-span-2 flex items-center">
              <p className="font-medium">Cateogry Name</p>
            </div>
            <div className="col-span-1 hidden items-center sm:flex">
              <p className="font-medium">Parent Category</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Products</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Actions</p>
            </div>
          </div>

          {allCategories &&
            allCategories.map((category, index) => (
              <div
                className="grid grid-cols-5 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-5 md:px-6 2xl:px-7.5"
                key={index}
              >
                <div className="col-span-2 flex items-center">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    
                    <p className="text-sm text-black dark:text-white">
                      {category.categoryName}
                    </p>
                  </div>
                </div>
                <div className="col-span-1 hidden items-center sm:flex">
                  <p className="text-sm text-black dark:text-white">
                    {category.parentCategory}
                  </p>
                </div>
                <div className="col-span-1 flex items-center">
                  <p className="text-sm text-black  dark:text-white">
                    {category.productCount}
                  </p>
                </div>
                <div className="col-span-1 flex items-center space-x-3.5">
                  <button
                    className="hover:text-primary"
                    title="Edit"
                    onClick={() => handleEdit(category)}
                  >
                    <FontAwesomeIcon icon={faPencilAlt} size="sm" className="fill-current" />
                  </button>
                  <button
                    className={`transition-all duration-200 hover:text-primary ${category.status === "running" && "text-success text-xl"}`}
                    title={category.status === "running" ? "running..." : "refresh-scraper"}
                    onClick={() => scrape(category)}
                    disabled={category.status === "running"}
                  >{category.status === "running" ? <FontAwesomeIcon icon={faArrowsRotate} spin /> : <FontAwesomeIcon icon={faArrowsRotate} />}
                  </button>
                  <button
                    className="hover:text-primary"
                    title="delete-category"
                    onClick={() => showDeleteModel(category)}
                  ><FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button
                    className="hover:text-primary"
                    title="Visit Page"
                    onClick={() => visitCategory(category)}
                  >
                    <FontAwesomeIcon icon={faLink} />
                  </button>
                </div>
              </div>
            ))}
        </div>) : (<h1>No category for this serach</h1>)}
        <PaginatedItems setPage={setPage} itemsPerPage={itemsPerPage} itemsCount={count} />
      </div>
    </div>
  );
};

export default CategoriesPage;
