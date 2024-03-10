"use client";
import Banner from "@/components/Banner";
import CategoryGrid from "@/components/CategoryGrid";
import PaginatedItems from "@/components/pagination/Pagination";
import ProductBox from "@/components/ProductBox";
import React, { useEffect, useState } from "react";
import LoadingSearchResult from "./loading";

const page = ({ params }) => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({ products: [], categories: [] });
  const searchValue = decodeURIComponent(params.searchValue);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/search?searchValue=${searchValue}&page=${page}&perPage=10`
        );
        const result = await response.json();
        setData(result.body);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [searchValue, page]);

  useEffect(() => {
    const handleWindowBlur = () => {
      console.log("Window lost focus");
    };
    window.addEventListener("blur", handleWindowBlur);
  }, []);
  return (
    <>
      <Banner text={`Results for ${searchValue}`} />
      {!loading ? (
        <div>
          {data.categories && data.categories.length > 0 && (
            <section className="border-b-stroke border-b-4  ">
              <CategoryGrid categories={data.categories} />
            </section>
          )}
          {data.products && data.products.length > 0 && (
            <section className=" mx-5 md:mx-40 mt-10  grid lg:grid-cols-2 gap-10 justify-items-center">
              {data.products.map((product) => (
                <ProductBox key={product._id} product={product} />
              ))}
            </section>
          )}
        </div>
      ) : (
        <LoadingSearchResult />
      )}
      <div className="flex sm:w-[80%] w-[95%] md:justify-end justify-center mt-4 py-2">
        <PaginatedItems
          setPage={setPage}
          itemsCount={data.totalProductCount}
          itemsPerPage={10}
        />
      </div>
    </>
  );
};

export default page;
