"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [subCategoryOf, setSubCategoryOf] = useState("");
  const [categoryLink, setCategoryLink] = useState("");
  const [categoryKeywords, setCategoryKeywords] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState();
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category");
      if (response.ok) {
        const data = await response.json();
        const {populatedCategories} = data
        setCategories(populatedCategories);
        // console.log(data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    if(!categoryName || !categoryType){
      setError('Complete All Required Fields.')
      return
    }
    if(categoryType==="Amazon" && !categoryLink){
      setError('categroy link is missing.')
      return
    }
    let parentCategory;
    if (subCategoryOf) {
      parentCategory = categories.find((category) => category.categoryName === subCategoryOf);
    }
    
    try {
      const response = await fetch("/api/category", {
        method: "POST",
        body: JSON.stringify({
          categoryName,
          categoryType,
          categoryLink,
          categoryKeywords,
          subCategoryOf: subCategoryOf ? subCategoryOf : null,
        }),
      });
      console.log(response)
      if (response.ok) {
        
        setCategoryName("");
        setCategoryType("");
        setSubCategoryOf("");
        setCategoryKeywords("");
        setCategoryLink("");
        router.back();
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          Add New Category
        </h3>
      </div>
      <div className="p-6.5">
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full ">
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
            Type
          </label>
          <div className="relative z-20 bg-transparent dark:bg-form-input">
            <select
              className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary "
              onChange={(e) => setCategoryType(e.target.value)}
              value={categoryType}
            >
              <option value="">Select a Type</option>
              <option value="Amazon">Amazon</option>
              <option value="Custom">Custom</option>
              {/* <option value="">Canada</option> */}
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
        {categoryType === "Amazon" && (
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full ">
            <label className="mb-2.5 block text-black dark:text-white">
              Category Link
            </label>
            <input
              type="text"
              placeholder="Enter Category Link"
              value={categoryLink}
              onChange={(e) => setCategoryLink(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
        </div>
        )}
        
        {categoryType === "Custom" && (
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full ">
            <label className="mb-2.5 block text-black dark:text-white">
              Keywords
            </label>
            <input
              type="text"
              placeholder="Enter keywords"
              value={categoryKeywords}
              onChange={(e) => setCategoryKeywords(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
        </div>
        )}
        
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Sub-Category Of
          </label>
          <div className="relative z-20 bg-transparent dark:bg-form-input">
            <select
              className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary "
              onChange={(e) => setSubCategoryOf(e.target.value)}
              value={subCategoryOf}
            >
              <option value="">Select a Parent (Optional)</option>
              {categories &&
                categories.map((category) => (
                  <option value={category.categoryName}>
                    {category.categoryName}
                  </option>
                ))}
              {/* <option value="Custom">Custom</option> */}
              {/* <option value="">Canada</option> */}
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
        {error && (
            <div className="bg-meta-1 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}</div>)}

        <button
          className="flex w-full justify-center rounded bg-primary my-3 p-3 font-medium text-gray"
          onClick={(e) => submitHandler(e)}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddCategory;
