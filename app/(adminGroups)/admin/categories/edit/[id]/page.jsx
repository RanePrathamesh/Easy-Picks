"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = ({ params }) => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryOf, setSubCategoryOf] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category");
        if (response.ok) {
          const data = await response.json();

          setCategories(data.populatedCategories);
        }
      } catch (error) {
        console.error(error);
      }
    };
    const fetchCategory = async (id) => {
      const response = await fetch(`/api/category/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCategory(data);
        const { categoryName, parentCategory } = data;
        setCategoryName(categoryName);
        setSubCategoryOf(parentCategory);
      } else {
        console.error(`Failed to fetch category: ${response.status}`);
      }
    };
    fetchCategory(params.id);
    fetchCategories();
  }, [params.id]);

  async function submitHandler(e) {
    e.preventDefault();
    if(category.categoryName != categoryName || category.parentCategory != subCategoryOf){
      // get Category._id by subCategoryOf(String- name of some category)
      const newParent = categories.filter((category) => category.categoryName === subCategoryOf)
      const response = await fetch(`/api/category/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: categoryName, parent: newParent.length<1 ? null : newParent[0]._id }),
      });
      if (response.ok) {
        router.back();
      } else {
        console.error(`Failed to update category: ${response.status}`);
      }
    }
  }
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <p className="font-medium text-black dark:text-white">
          Manage Category - {category && category._id}
        </p>
        <p>
          <span className=" font-bold px-2 text-xl">
            {category && category.productCount}
          </span>
          Products
        </p>
      </div>
      <div className="p-6.5">
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-1/2">
            <label className="mb-2.5 block text-black dark:text-white">
              Category Name
            </label>
            <input
              type="text"
              placeholder="Enter category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
        </div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Sub-Category Of
          </label>
          <div className="relative z-20 bg-transparent dark:bg-form-input">
            <select
              className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary "
              onChange={(e) => setSubCategoryOf(e.target.value)}
              value={subCategoryOf != null && subCategoryOf}
            >
              <option key={0} value='none'>Select a Parent (Optional)</option>
              {categories &&
                categories.map((category, i) => (
                  <option key={i} value={category.categoryName}>
                    {category.categoryName}
                  </option>
                ))}
              {/* <option value="Custom">Custom</option>
              <option value="">Canada</option> */}
            </select>
            <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
              <svg
                className="fill-current"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.8">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                    fill=""
                  ></path>
                </g>
              </svg>
            </span>
          </div>
        </div>
        <div className="flex  space-x-5">
          <button
            className="inline-flex items-center rounded-md justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            onClick={(e) => submitHandler(e)}
          >
            Update
          </button>
          <button
            className="inline-flex items-center rounded-md justify-center bg-black py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            onClick={() => router.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
