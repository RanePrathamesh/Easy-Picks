"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = ({ params }) => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryOf, setSubCategoryOf] = useState(null);
  const [user, setUser] = useState({})
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async (id) => {
      const response = await fetch(`/api/users/${id}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data)
        const {name, role, status} = data;
        // console.log(data);
        setUserName(name);
        setUserRole(role);
        setUserStatus(status);
      } else {
        console.error(`Failed to fetch user: ${response.status}`);
      }
    };
    fetchUser(params.id);
  }, [params.id]);

  async function submitHandler(e) {
    e.preventDefault();
    if (
      user.name != userName ||
      user.role != userRole || user.status != userStatus
    ) {
      const response = await fetch(`/api/users/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userName,
          role: userRole,
          status: userStatus
        }),
      });
      if (response.ok) {
        router.back();
      } else {
        console.error(`Failed to update user: ${response.status}`);
      }
    }
  }
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <p className="font-medium text-black dark:text-white">
          Manage User - {userName && userName}
        </p>
      </div>
      <div className="p-6.5">
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-1/2">
            <label className="mb-2.5 block text-black dark:text-white">
              User Name
            </label>
            <input
              type="text"
              placeholder="Enter user name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            User Role
          </label>
          <div className="flex">
            <label className="mr-4">
              <input
                type="radio"
                value="Standard"
                checked={userRole === "Standard"}
                onChange={() => setUserRole("Standard")}
              />
              <span className="ml-2">Standard</span>
            </label>
            <label>
              <input
                type="radio"
                value="Admin"
                checked={userRole === "Admin"}
                onChange={() => setUserRole("Admin")}
              />
              <span className="ml-2">Admin</span>
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            User Status
          </label>
          {userStatus != 'Setup' ? (
          <div className="flex">
            <label className="mr-4">
              <input
                type="radio"
                value="Active"
                checked={userStatus === "Active"}
                onChange={() => setUserStatus("Active")}
              />
              <span className="ml-2">Active</span>
            </label>
            <label>
              <input
                type="radio"
                value="Admin"
                checked={userStatus === "Inactive"}
                onChange={() => setUserStatus("Inactive")}
              />
              <span className="ml-2">Inactive</span>
            </label>
          </div>
          ) : (
            <div className="m-2 text-primary-orange">**USER IS STILL IN SETUP STAGE**</div>
          )}
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
