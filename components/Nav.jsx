"use client";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// const Nav = () => {
//   const router = useRouter();
//   const [searchValue, setSearchValue] = useState("");

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     setSearchValue("");
//     router.push(`/search/${searchValue}`);
//   };
//   return (
//     <nav className="bg-white border-gray-200 dark:bg-gray-900 sticky  top-0 z-50">
//       <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
//         <Link href="/" className="flex items-center">
//           <Image src='/logo2.png' width={50} height={50} alt="logo" />
//           <span className="self-center md:text-2xl text-lg font-semibold whitespace-nowrap dark:text-white">
//             BEST PRODUCTS
//           </span>
//         </Link>
//         <div className="flex flex-grow justify-end md:mx-10">
//           <ul className="p-2 md:p-0 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
//             <li className="text-center">
//               <Link
//                 href="/categories"
//                 className=" md:py-2 md:pl-3 md:pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
//               >
//                 Catalogue
//               </Link>
//             </li>
//           </ul>
//         </div>
//         <form
//           onSubmit={handleSearchSubmit}
//           className="w-full pt-2.5 md:pt-0 sm:w-fit"
//         >
//           <label
//             htmlFor="default-search"
//             className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
//           >
//             Search
//           </label>
//           <div className="relative sm:my-0 my-1">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//               <svg
//                 className="w-4 h-4 text-gray-500 dark:text-gray-400"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   stroke="currentColor"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
//                 />
//               </svg>
//             </div>
//             <input
//               type="search"
//               id="default-search"
//               value={searchValue}
//               onChange={(e) => setSearchValue(e.target.value)}
//               className="block w-full sm:p-4 p-2 sm:pl-10 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//               placeholder="Search..."
//               required
//             />
//             <button
//               type="submit"
//               className="text-white absolute sm:right-2.5 sm:bottom-2.5 right-1 bottom-1 bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg sm:text-sm text-xs px-4 sm:py-2 py-1.5  dark:bg-primary dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
//             >
//               Search
//             </button>
//           </div>
//         </form>
//       </div>
//     </nav>
//   );
// };

// export default Nav;

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedSearchValue = searchValue.trim();
    if (trimmedSearchValue !== "" && trimmedSearchValue.length <= 30) {
      router.push(`/search/${trimmedSearchValue}`);
      setIsContentVisible(false);
      setSearchValue('')
    } else {
      console.log("Invalid search value length");
    }
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        {/* Large Screen Layout */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Link href="/" className="flex">
            <Image src="/logo2.png" width={50} height={50} alt="Logo" className="w-[50px] h-[50px]"/>
            <span className="self-center hidden md:block md:text-2xl font-semibold whitespace-nowrap ">
              Easy Picks
            </span>
          </Link>
        </div>
        <div className="hidden md:flex space-x-4 items-center">
          <Link
          href='/categories'
            className=" hover:opacity-80 rounded-lg text-black-2 text-base p-2.5 me-1"
          >
            
            
            
          </Link>
          
        </div>

        {/* Small Screen Layout */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsContentVisible(!isContentVisible)}
            className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 me-1"
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <button
            onClick={() => setIsContentVisible(!isContentVisible)}
            className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 me-1"
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </button>
        </div>

        {/* Content Box for Small Screen */}
        {isContentVisible && (
          <div className="md:hidden fixed z-99 top-20 left-0 h-full w-full bg-opacity-90  bg-black-2 border-r border-gray-200 dark:bg-gray-900">
            <div className="p-4 ">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  id="search-navbar-mobile"
                  className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search Product / Category ..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-full mt-2 px-3 py-2 text-sm bg-meta-5 text-white rounded-md"
                >
                  Search
                </button>
              </form>
              <div className="mt-5 ">
                <h2 className="text-lg font-inter font-semibold text-gray-3 py-2">Main Links </h2>
                <button onClick={() => {setIsContentVisible(!isContentVisible)
                router.push('/categories')
                }} className="w-full block py-2 cursor-pointer space-x-2 text-left text-white font-semibold rounded bg-transparent hover:text-black "><FontAwesomeIcon icon={faArrowRight} /><Link href={'/categories'}>
                Categories
                </Link></button>

                <button onClick={() => {setIsContentVisible(!isContentVisible)
                router.push('/about-us')
                }} className="w-full block py-2 cursor-pointer space-x-2 text-left text-white font-semibold rounded bg-transparent hover:text-black "><FontAwesomeIcon icon={faArrowRight} /><Link href={'/categories'}>
                About Us
                </Link></button>
                
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
