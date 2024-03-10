"use client";
import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);

  const router = useRouter();

  const handleEdit = async (user) => {
    router.push(`users/edit/${user._id}`);
  };
  
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/users");
      const { users } = await response.json();
      setAllUsers(users);
    };
    fetchUsers();
  }, []);
  return (
    <div>
      <Breadcrumb pageName="Users" />
      <Link
              href="/admin/auth/signup"
              className="inline-flex items-center rounded-md justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 mb-5"
            >
              Add User
            </Link>
      {allUsers.length > 0 ? (
        <div className="flex flex-col gap-10">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="py-6 px-4 md:px-6 xl:px-7.5">
              <h4 className="text-xl font-semibold text-black dark:text-white">
                All Users
              </h4>
            </div>

            <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-6 md:px-6 2xl:px-7.5">
              <div className="col-span-1 flex items-center">
                <p className="font-medium">Name</p>
              </div>
              <div className="col-span-2 hidden items-center sm:flex">
                <p className="font-medium">Email</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="font-medium">Role</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="font-medium">Status</p>
              </div>
              
              <div className="col-span-1 flex items-center">
                <p className="font-medium">Actions</p>
              </div>
            </div>

            {allUsers &&
              allUsers.map((user, index) => (
                <div
                  className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-6 md:px-6 2xl:px-7.5"
                  key={index}
                >
                  <div className="col-span-1 flex items-center">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <p className="text-sm text-black dark:text-white">
                        {user.name}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2 hidden items-center sm:flex">
                    <p className="text-sm text-black dark:text-white">
                      {user.email}
                    </p>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <p className="text-sm text-black  dark:text-white">
                      {user.role}
                    </p>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <p className="text-sm text-black  dark:text-white">
                      {user.status}
                    </p>
                  </div>
                  <div className="col-span-1 flex items-center space-x-3.5">
                    <button
                      className="hover:text-primary"
                      title="Edit"
                      onClick={() => handleEdit(user)}
                    >
                      <FontAwesomeIcon icon={faPencilAlt} size="sm" className="fill-current" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <Loader/>
      )}
    </div>
  );
};

export default Users;
