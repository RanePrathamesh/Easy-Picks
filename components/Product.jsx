"use client";
import sbd from "sbd";
import { collectProductClickData } from "@/services/interactivityService";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import Tags from "./Tags";

const Product = ({ product, rank }) => {
  let searchParams;
  let visitId;
  let currentUrl;
  searchParams = useSearchParams().get("filter");
  useEffect(() => {
    currentUrl = window.location.href;
    visitId = localStorage.getItem("visitId");
  });

  const truncatedTitle =
    product.title.length > 40
      ? product.title.slice(0, 30) + "..."
      : product.title;

  const starRating = "★".repeat(Math.round(product.rating));

  const formattedDiscount = `${Math.abs(product.savingsPercentage)}% Off`;

  const pattern = /\\([^\\]+\\mainImage.png)$/;
  const match = product.mainImageSrc.match(pattern);

  if (match && match[1]) {
    product.mainImageSrc = match[1];
  }

  const [showDescription, setShowDescription] = useState(false);

  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  async function productClicked(product) {
    await collectProductClickData({
      productId: product._id,
      pathName: currentUrl,
      position: rank + 1,
      filter: searchParams,
      visitId,
    });
  }
  function formatDescription(description) {
    const sentences = sbd.sentences(description);
    return sentences.map((sentence, index) => (
      <p key={index}>{sentence.trim()}</p>
    ));
  }

  return (
    <>
      <div className=" bg-white  relative shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 hover:scale-100 rounded-lg mb-6" onClick={() => productClicked(product)}>
        {!rank && <Tags tag={"Best Choice"} />}
        <div className="sm:flex relative items-center justify-between sm:pr-20 sm:py-0 py-2">
          <a
            href={
              !product.url.includes("amazon.in")
                ? `https://amazon.in${product.url}`
                : product.url
            }
            className="sm:items-center sm:w-full sm:justify-evenly sm:flex "
            target="_blank"
          >
            <div className="rounded-2xl sm:w-36 sm:h-36 w-60 h-60 ml-5 md:-mb-3 md:mt-3  my-element">
              <Image
                src={`/images/products/${product.productID}/mainImage.webp`}
                width={200}
                height={200}
                alt={product.brand}
                className="object-contain "
              />
            </div>
            <div className="text-black align-middle ml-6 block">
              <div className="text-xl sm:flex-row w-full">{truncatedTitle}</div>
              <div className="text-gray-800 ">{product.brand}</div>
              <div className="product-discount">
                <p>{formattedDiscount}</p>
              </div>
            </div>
            <div className="sm:ml-6 absolute top-2 right-2 px-2 sm:px-0 sm:relative text-primary text-center">
              <span className="text-3xl font-black text-black opacity-90  ">
                {product.personalizedRating}
              </span>
              <p>{starRating} </p>
            </div>
          </a>

          <a
            href={product.url}
            className="sm:w-60 block w-auto m-5  sm:inline whitespace-nowrap text-center h-auto p-2 rounded-xl text-xl font-bold text-white bg-primary sm:justify-center"
            target="_blank"
          >
            Get Deal
          </a>
        </div>
        <div className="product-description">
          <button
            className="description-toggle-button mr-2"
            onClick={toggleDescription}
          >
            View Description {showDescription ? "▲" : "▼"}
          </button>
          {showDescription && (
            <div className="text-black grid md:grid-cols-3">
              <div className="text-left col-span-2">
                {product.description.split("\n").map((line, index) => (
                  <p className="font-normal p-0.5" key={index}>
                    {line.trim()}
                  </p>
                ))}
              </div>
              <div className="col-span-1">
                <div className="py-5 justify-start">
                  <div className="text-xl font-bold">₹{product.priceToPay}</div>
                  <div className="flex justify-end">
                    <div className="inline-block text-lg font-light line-through">
                      ₹{product.mrp}
                    </div>
                    <div className="text-md font-normal from-danger">
                      {product.savingsPercentage}% OFF
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Image
                    src="/images/amazon.svg"
                    alt="Amazon"
                    width={150}
                    height={150}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;
