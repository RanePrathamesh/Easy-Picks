"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { unsubscribeForNewsletter } from "@/services/newsletterService";

const Unsubscribe = ({ searchParams }) => {
  const [email, setEmail] = useState();
  const [error, setError] = useState("");
  const router = useRouter();
  useEffect(() => {
      if (searchParams.email) {
        setEmail(searchParams.email);
      }
  }, [])
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
          setError('Invalid email address');
          return;
        }
        await unsubscribeForNewsletter(email);
        setEmail('');
        router.push("/");

      } catch (error) {
        console.log('Error unsubscribing email:', error);
      }
  };
  return (
    // <div>Unsubscribe {searchParams.email}</div>
    <>
      <div className="lg:mx-70 my-5 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="w-full border-stroke dark:border-strokedark  xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Unsubscribe :
                  </label>
                  <div className="relative ">
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="Enter your email"
                      className="md:w-100 md:text-base text-sm w-55 rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-5 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <input
                    type="submit"
                    value="Submit"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
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
  );
};

export default Unsubscribe;
