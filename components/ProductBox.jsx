"use client";
import { collectProductClickData } from "@/services/interactivityService";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import DescriptionPopup from "./DescriptionPopup";

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
      ? product.title.slice(0, 40) + "..."
      : product.title;

  const starRating = "★".repeat(Math.round(product.rating));

  const formattedDiscount = product.savingsPercentage
    ? `${product.savingsPercentage}% Off`
    : "";

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
  // const [fallbackAttempted, setFallbackAttempted] = useState(false);

  // const handleImageError = (event) => {
  //   if (!fallbackAttempted) {
  //     console.log('Not supported or found - ',product.productID,'/mainImage.webp');
  //     setFallbackAttempted(true);
      
  //     event.target.srcset = `/${product.productID}/mainImage.png`;
  //     console.log(`New  -   /${product.productID}/mainImage.png`);

  //   }
  // };
  const [imageExists, setImageExists] = useState(false);
  const imagePathWebp = `/images/products/${product.productID}/mainImage.webp`;
  const imagePathPng = `/images/products/${product.productID}/mainImage.png`;

  useEffect(() => {
    const checkImageExists = async () => {
      try {
        const webpResponse = await fetch(imagePathWebp);
        if (webpResponse.ok) {
          setImageExists(true);
        }  else {
          // Neither WebP nor PNG exists
          setImageExists(false);
        }
      } catch (error) {
        // Handle errors
        setImageExists(false);
      }
    };

    checkImageExists();
  }, [imagePathWebp, imagePathPng]);

  const handleImageError = (e) => {
    console.error('Error loading image:', e.target.src);
    // Set a fallback image or an empty string
    e.target.srcset = '/fallback.webp'; 
  };

  return (
    <>
      <div
        className="bg-white w-full grid grid-cols-3 rounded-xl justify-items-center hover:drop-shadow-2 relative"
        onClick={() => productClicked(product)}
        style={{ gridTemplateColumns: "40% 40% 20%" }}
      >
        <div className="py-3 grid grid-cols-1 gap-5">
          <a
            href={
              !product.url.includes("amazon.in")
                ? `https://amazon.in${product.url}`
                : product.url
            }
            className=""
            target="_blank"
          >
            <div className="">
              <Image
                src={imageExists ? imagePathWebp : imagePathPng ? imagePathPng : '/fallback.webp'}
                width={100}
                height={100}
                alt={product.brand}
                className="object-contain  rounded-xl"
                onError={(e) => handleImageError(e)}
              />
            </div>
          </a>

          <a
            href={
              !product.url.includes("amazon.in")
                ? `https://amazon.in${product.url}`
                : product.url
            }
            className="rounded-lg text-center text-lg font-semibold text-white bg-primary"
            target="_blank"
          >
            Get Deal
          </a>
        </div>
        <div className="pt-5 pb-2.5">
          <div className="h-4/5 justify-items-start">
          <div className="font-satoshi md:text-base text-sm line-clamp-2">
            {truncatedTitle}
          </div>
          <div className="font-bold text-strokedark line-clamp-1">{product.brand}</div>
          <div className="product-discount w-max rounded-lg">
                  <p className="text-xs font-medium">
                    {product.savingsPercentage || "0"}% Off
                  </p>
                </div>
          </div>
          <div className="desc bg-black-50">
            <button
              className="text-body  font-medium"
              onClick={toggleDescription}
            >
              {showDescription ? "" : "Show Details"}
            </button>
            {showDescription && (
              <DescriptionPopup product={product} onClose={toggleDescription} />
            )}
          </div>
        </div>
        <div className="">
          <div className="text-center text-base bg-gray pt-5 pb-2 px-1.5 mr-5 rounded-b-lg">
            <span className="font-bold text-graydark">
              {product.personalizedRating ? product.personalizedRating : "9.8"}
            </span>
            <p className="font-medium text-meta-5">{starRating} </p>
          </div>
        </div>
      </div>
    </>
  );
};
// absolute right-4 md:right-6 bottom-5 md:bottom-5
export default Product;
