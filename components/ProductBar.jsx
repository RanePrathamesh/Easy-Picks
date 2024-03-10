"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { collectProductClickData } from "@/services/interactivityService";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import Tags from "./Tags";

const ProductBar = ({ product, rank }) => {
  let searchParams;
  let visitId;
  let currentUrl;
  searchParams = useSearchParams().get("filter");
  useEffect(() => {
    currentUrl = window.location.href;
    visitId = localStorage.getItem("visitId");
  });

  function generateStarRating(rating) {
    const scaledRating = rating / 2;
    const hasHalfStar = scaledRating % 1 >= 0.5;

    if (rating < 9) {
      return (
        <>
          <FontAwesomeIcon icon={faStar} size="xs" width={13} height={13}/>
          <FontAwesomeIcon icon={faStar} size="xs" width={13} height={13}/>
          <FontAwesomeIcon icon={faStar} size="xs" width={13} height={13}/>
          <FontAwesomeIcon icon={faStar} size="xs" width={13} height={13}/>
        </>
      );
    }

    if (rating >= 9 && rating <= 9.7) {
      return (
        <>
          <FontAwesomeIcon icon={faStar} size="xs" width={13} height={13}/>
          <FontAwesomeIcon icon={faStar} size="xs" width={13} height={13}/>
          <FontAwesomeIcon icon={faStar} size="xs" width={13} height={13}/>
          <FontAwesomeIcon icon={faStar} size="xs" width={13} height={13}/>
          {hasHalfStar && <FontAwesomeIcon icon={faStarHalfStroke} size="xs" width={13} height={13}/>}
        </>
      );
    }
    return (
      <>
        <FontAwesomeIcon icon={faStar} size="xs" width={13} height={13} />
        <FontAwesomeIcon icon={faStar} size="xs" width={13} height={13} />
        <FontAwesomeIcon icon={faStar} size="xs" width={13} height={13} />
        <FontAwesomeIcon icon={faStar} size="xs" width={13} height={13} />
        <FontAwesomeIcon icon={faStar} size="xs" width={13} height={13} />
      </>
    );
  }
  const starRating = generateStarRating(product.personalizedRating);

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
  const [imageExists, setImageExists] = useState(false);
  const imagePathWebp = `/images/products/${product.productID}/mainImage.webp`;
  const imagePathPng = `/images/products/${product.productID}/mainImage.png`;

  useEffect(() => {
    const checkImageExists = async () => {
      try {
        const webpResponse = await fetch(imagePathWebp);
        if (webpResponse.ok) {
          setImageExists(true);
        } else {
          setImageExists(false);
        }
      } catch (error) {
        setImageExists(false);
      }
    };

    checkImageExists();
  }, [imagePathWebp, imagePathPng]);

  const handleImageError = (e) => {
    console.error("Error loading image:", e.target.src);
    e.target.srcset = "/fallback.webp";
  };
  return (
    <>
      <div
        className="w-full bg-white relative shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 hover:scale-100 rounded-lg mb-6"
        onClick={() => productClicked(product)}
      >
        {!rank && <Tags tag={"Best Choice"} />}
        <div className="absolute -left-5 md:top-12 top-15 ">
          <div className="rounded-full bg-liwh w-10 h-10 flex justify-center items-center text-lg font-satoshi font-semibold text-graydark">
            {rank + 1}
          </div>
        </div>
        <div
          className="py-1 px-2 lg:grid lg:grid-cols-3"
          style={{ gridTemplateColumns: "40% 30% 30%" }}
        >
          <div className="col-span-2">
            <a
              href={
                !product.url.includes("amazon.in")
                  ? `https://amazon.in${product.url}`
                  : product.url
              }
              className="md:flex items-center justify-evenly "
              target="_blank"
            >
              <div className="sm:mx-5 md:px-0 px-4  py-4">
                <Image
                  src={
                    imageExists
                      ? imagePathWebp
                      : imagePathPng
                      ? imagePathPng
                      : "/fallback.webp"
                  }
                  width={140}
                  height={140}
                  alt={product.brand}
                  className="object-contain w-28 h-28 sm:w-35 sm:h-35 md:w-25 md:h-25 rounded-xl"
                  onError={(e) => handleImageError(e)}
                />
              </div>
              <div className="md:px-12 lg:pl-0 px-5 md:py-0 py-3">
                <h2 className="sm:w-70 font-inter  text-base font-semibold text-graydark opacity-90 line-clamp-2">
                  {product.title}
                </h2>
                <div className="brand-color">{product.brand}</div>
                <div className="product-discount w-max rounded-lg">
                  <p className="text-xs font-medium">
                    {product.savingsPercentage || "0"}% Off
                  </p>
                </div>
              </div>
              <div className=" text-primary opacity-90 text-center md:static absolute top-3 right-3">
                <span className="md:text-3xl text-xl font-black text-black opacity-90">
                  {product.personalizedRating}
                </span>
                <p className="my-1 flex justify-center md:h-[13px]">{starRating} </p>
                <h5 className="font-satoshi text-sm font-semibold">
                  {product.personalizedRating > 9.7
                    ? "Exceptional"
                    : product.personalizedRating > 9
                    ? "Excellent"
                    : product.personalizedRating > 8.5
                    ? "Very Good"
                    : "Good"}
                </h5>
              </div>
            </a>
          </div>
          <div className="col-span-1 px-4 flex flex-col md:mt-7 sm:items-center">
            <a
              href={product.url}
              className="text-center py-2 lg:w-5/6 w-full rounded-xl text-base font-inter font-semibold text-white bg-primary "
              target="_blank"
            >
              View Deal
            </a>

            <div className="flex mt-5  lg:w-5/6 w-full justify-between text-sm font-inter text-graydark font-medium">
              <p>On Amazon</p>
              <button className="cursor-pointer" onClick={toggleDescription}>
                {showDescription ? "Show less ▲" : "Show More ▼"}
              </button>
            </div>
          </div>
        </div>
        <div
          className={`desc overflow-hidden transition-max-height ease-in-out duration-1000 ${
            showDescription ? "max-h-full" : "max-h-0"
          }`}
          style={{ maxHeight: showDescription ? "2000px" : "0" }}
        >
          {showDescription && (
            <div className="text-black md:grid md:grid-cols-3 md:pl-10 pl-4 py-5">
              <div className="text-left md:col-span-2 pr-3 md:pr-0">
                <p className="font-inter font-semibold pb-1">Main Highlights</p>
                {product.description.split("\n").map((line, index) => (
                  <p className="font-normal p-0.5" key={index}>
                    {line.trim()}
                  </p>
                ))}
              </div>
              <div className="md:col-span-1 md:flex-col md:justify-items-end  md:text-right ">
                <div className="py-5 md:pr-15 md:grid flex justify-center md:justify-end space-x-3">
                  <div className="text-xl font-bold">₹{product.priceToPay}</div>
                  <div className=" text-xl font-light line-through">
                    ₹{product.mrp}
                  </div>
                  <div className="text-lg font-normal from-danger">
                    {product.savingsPercentage}% OFF
                  </div>
                </div>
                <div className="flex md:justify-end justify-center md:pr-10">
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

export default ProductBar;
