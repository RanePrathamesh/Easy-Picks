"use client";

// import Link from "next/link";
import { useState } from "react";
import { redirect, useRouter } from "next/navigation";

// import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { toast } from "react-toastify";
import { tosterProps } from "@/utils/generic-util";
import { useSession } from "next-auth/react";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const { data: session } = useSession();
  if (!session || !session?.user || session?.user?.role != "Admin") {
    redirect("/admin");
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !userType) {
      setError("All fields are necessary.");
      return;
    } 
    setCreating(true);

    try {
      const resUserExists = await fetch("api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        setCreating(false);
        setError("User already exists.");
        return;
      }

      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          userType,
        }),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        toast.success(`User '${name}' Created Successfully.`, tosterProps);
      } else {
        toast.error("User registration failed.", tosterProps);
      }
    } catch (error) {
      console.log("Error during registration: ", error);
      toast.error(`Error during registration: ${error}`, tosterProps);
    }
    setCreating(false);
  };

  return (
    <>
      {session?.user?.role === "Admin" && (
        <>
          <Breadcrumb pageName="Add User" />
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex flex-wrap items-center">
              <div className="w-full border-stroke dark:border-strokedark  xl:border-l-2">
                <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                  {/* <span className="mb-1.5 block font-medium">Start for free</span> */}
                  {/* <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                    Add User to Admin Panel
                  </h2> */}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Name
                      </label>
                      <div className="relative">
                        <input
                          onChange={(e) => setName(e.target.value)}
                          type="text"
                          placeholder="Enter your full name"
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />

                        <span className="absolute right-4 top-4">
                          <svg
                            className="fill-current"
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.5">
                              <path
                                d="M11.0008 9.52185C13.5445 9.52185 15.607 7.5281 15.607 5.0531C15.607 2.5781 13.5445 0.584351 11.0008 0.584351C8.45703 0.584351 6.39453 2.5781 6.39453 5.0531C6.39453 7.5281 8.45703 9.52185 11.0008 9.52185ZM11.0008 2.1656C12.6852 2.1656 14.0602 3.47185 14.0602 5.08748C14.0602 6.7031 12.6852 8.00935 11.0008 8.00935C9.31641 8.00935 7.94141 6.7031 7.94141 5.08748C7.94141 3.47185 9.31641 2.1656 11.0008 2.1656Z"
                                fill=""
                              />
                              <path
                                d="M13.2352 11.0687H8.76641C5.08828 11.0687 2.09766 14.0937 2.09766 17.7719V20.625C2.09766 21.0375 2.44141 21.4156 2.88828 21.4156C3.33516 21.4156 3.67891 21.0719 3.67891 20.625V17.7719C3.67891 14.9531 5.98203 12.6156 8.83516 12.6156H13.2695C16.0883 12.6156 18.4258 14.9187 18.4258 17.7719V20.625C18.4258 21.0375 18.7695 21.4156 19.2164 21.4156C19.6633 21.4156 20.007 21.0719 20.007 20.625V17.7719C19.9039 14.0937 16.9133 11.0687 13.2352 11.0687Z"
                                fill=""
                              />
                            </g>
                          </svg>
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Email
                      </label>
                      <div className="relative">
                        <input
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          placeholder="Enter your email"
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />

                        <span className="absolute right-4 top-4">
                          <svg
                            className="fill-current"
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.5">
                              <path
                                d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                                fill=""
                              />
                            </g>
                          </svg>
                        </span>
                      </div>
                    </div>

                    

                    <div className="mb-4">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        User Type
                      </label>
                      <div className="flex">
                        <label className="mr-4">
                          <input
                            type="radio"
                            value="Standard"
                            checked={userType === "Standard"}
                            onChange={() => setUserType("Standard")}
                          />
                          <span className="ml-2">Standard</span>
                        </label>
                        <label>
                          <input
                            type="radio"
                            value="Admin"
                            checked={userType === "Admin"}
                            onChange={() => setUserType("Admin")}
                          />
                          <span className="ml-2">Admin</span>
                        </label>
                      </div>
                    </div>


                    <div className="mb-5">
                      <input
                        type="submit"
                        value={creating ? "Creating..." : "Create Account"}
                        className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                        disabled={creating}
                      />
                    </div>
                    {error && (
                      <div className="bg-meta-1 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                        {error}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SignUp;
