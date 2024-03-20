"use client";
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
            <Image src="/easypicks1.jpg" width={50} height={50} alt="Logo" className="w-[50px] h-[50px]"/>
            <span className="self-center hidden md:block md:text-2xl font-semibold whitespace-nowrap ">
              Easy Picks
            </span>
          </Link>
          <Link href={"/"} className="flex">Home</Link>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
