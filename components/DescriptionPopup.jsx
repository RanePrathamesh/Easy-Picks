'use client'
import Image from "next/image";
import React, { useEffect, useState } from "react";
const DescriptionPopup = ({ product, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, []);
  const truncatedDesc =
    product.description.length > 500
      ? product.description.slice(0, 420) + "..."
      : product.description;
  return (
    <div className={`transition-opacity ease-in-out duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div
        className="w-full h-full description-popup absolute bottom-0 left-0 grid grid-cols-2 bg-meta-2 shadow-4 rounded-lg"
        style={{ gridTemplateColumns: "80% 20%" }}
      >
        <div className="p-3 font-normal md:text-sm text-xs">
          {truncatedDesc.split("\n").map((line, index) => (
            <p key={index}>{line.trim()}</p>
          ))}
        </div>
        <div className="col-span-1 space-x-2 w-full text-right">
          <button
            onClick={onClose}
            className="px-2 rounded-tr-lg text-white bg-meta-1 font-extrabold"
          >
            X
          </button>
          <div className="pt-3 pr-2 text-lg font-medium">
            ₹{product.priceToPay}
          </div>
          <div className="pr-2 pb-2">
            <div className="line-through">₹{product.mrp}</div>
            <div>
              {product.savingsPercentage ? product.savingsPercentage : "0"}% OFF
            </div>
          </div>
          <div>
            <Image
              src="/amazon.svg"
              alt="Amazon"
              width={120}
              height={120}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescriptionPopup;
