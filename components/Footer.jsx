"use client";
import React, { useState } from "react";
import "@/styles/Footer.css";
import Link from "next/link";
import { saveEmailForNewsletter } from "@/services/newsletterService";
import { usePathname } from "next/navigation";
const Footer = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const pathname = usePathname();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let interest = "Home";
    if (pathname === "/") {
      interest = "Home";
    } else if (pathname === "/categories") {
      interest = "Categories";
    } else if (pathname.includes("products")) {
      const categoryId = pathname.split("/")[1];
      interest = categoryId || "Unknown Category";
    } else if (pathname.includes("/search/")) {
      const searchTerm = pathname.split("/search/")[1];
      interest = searchTerm || "Unknown Search";
    }
    try {
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        setError("Invalid email address");
        return;
      }
      await saveEmailForNewsletter(email, interest, pathname);
      setEmail("");
      console.log("Email subscribed successfully!");
    } catch (error) {
      console.log("Error subscribing email:", error);
    }
  };
  return (
    <section>
      <div className="footer-container">
        <div className="row newsletter-box align-middle justify-items-center text-center">
          <div className="column text-lg font-satoshi font-semibold text-white font-3">
            Sign up and get exclusive special deals
          </div>
          <div className="column email-box items-center lg:mx-0 sm:mx-10 mx-2">
            <form className=" md:w-max" onSubmit={handleSubmit}>
              <div className="relative sm:my-0 my-1 ">
                <input
                  type="email"
                  id="default-search"
                  className="block w-full sm:p-4 p-2  text-sm text-gray-900 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="text-white absolute  right-0 bottom-0 bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg sm:text-sm text-xs px-6 sm:py-4 py-2.5  dark:bg-primary dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
                >
                  Sign up
                </button>
              </div>
              {error && (
                <div className="bg-meta-1 text-white w-fit text-sm py-1 sm:px-3 rounded-md mt-2">
                  {error}
                </div>
              )}
              <p className="text-whiter font-extralight py-2 md:text-left">
                *Emails submitted are subject to our Privacy Notice
              </p>
            </form>
          </div>
        </div>
        <div className="row links-row ">
          <div className="column space-y-2">
            <h2 className="font-bold text-lg">CATEGORIES</h2>
            <ul className="space-y-1">
              <li>Electronics</li>
              <li>Clothing</li>
              <li>Monitors</li>
              <li>Furniture</li>
            </ul>
          </div>
          <div className="column space-y-2 ">
            <h2 className="font-bold text-lg">CONTACT</h2>
            <ul className="space-y-1">
              <li>
                <Link href="/contact-us">Contact</Link>
              </li>
              <li>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/about-us">About</Link>
              </li>
              <li>
                <Link href="/categories">Categories</Link>
              </li>
            </ul>
          </div>
          <div className="column space-y-2 ">
            <Link href="/">
              <h2 className="font-bold text-title-xl">BEST PRODUCTS</h2>
            </Link>
          </div>
        </div>
        <div className="block text-xs text-center license py-2 text-white font-thin">
          Amazon, Amazon Prime, the Amazon logo and Amazon Prime logo are
          trademarks of Amazon.com, Inc. or its affiliates Copyright © 2023 by
          Bestproducts.com
        </div>
      </div>
    </section>
  );
};

export default Footer;
