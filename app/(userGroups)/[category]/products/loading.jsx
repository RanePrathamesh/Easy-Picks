import React from "react";

const LoadingProducts = () => {
  const numLoadingItems = 10;

  return (
    <>
      <div className="animate-pulse md:h-40 h-30 w-full relative lg:pl-52 pl-5  py-7 mb-5 bg-shady items-center ">
        <div className="h-2.5 bg-gray-200 rounded-full bg-gray-2 lg:w-[830px] md:w-[500px] w-[250px] my-4"></div>
        <div className="h-2.5 bg-gray-200 rounded-full bg-gray-2 md:w-[80px] w-[50px] md:mt-14 mt-4"></div>
      </div>
      <div className="w-full py-6 lg:max-w-5xl lg:px-0 px-7">
        {[...Array(numLoadingItems)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse w-full bg-white relative shadow-lg lg:h-36 md:h-55 h-94 rounded-lg mb-6"
          >
            <div
              className="py-1 px-2 lg:grid lg:grid-cols-3"
              style={{ gridTemplateColumns: "40% 30% 30%" }}
            >
              <div className="col-span-2">
                <div className="md:flex items-center justify-evenly ">
                  <div className="sm:mx-5 md:px-0 px-4  py-4 ">
                    <div className="w-28 h-28 sm:w-35 sm:h-35 md:w-25 md:h-25 rounded-xl bg-meta-9" />
                  </div>
                  <div className="md:px-12 lg:pl-0 pl-5 md:py-0 py-3">
                    <h2 className=" lg:w-100 font-inter text-lg font-semibold text-gray-80 md:line-clamp-1">
                      <div className="h-1.5 bg-black bg-opacity-50 rounded-full max-w-[330px] mb-2.5"></div>
                      <div className="h-1.5 bg-black bg-opacity-50 rounded-full max-w-[300px] mb-2.5"></div>
                    </h2>
                    <div className="brand-color">
                      <div className="h-2 bg-black bg-opacity-10 rounded-full max-w-[80px] mb-2.5"></div>
                    </div>
                    <div className=" w-15 rounded-lg">
                      <div className="h-2  rounded-full bg-meta-5  mt-5"></div>
                    </div>
                  </div>
                  <div className=" text-primary opacity-90 text-center md:static absolute top-3 right-3">
                    <p className="mt-1 text-lg">
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-span-1 px-4 flex flex-col md:mt-7 sm:items-center">
                <div className="text-center py-2 lg:w-5/6 w-full rounded-xl text-base font-inter font-semibold text-white bg-primary">

                      <div className="lg:h-2 h-1 my-2.5"></div>
                </div>

                <div className="flex lg:mt-5 mt-2 lg:w-5/6 w-full justify-between   font-medium">
                <div className="h-1 w-10 bg-form-strokedark rounded-full"></div>
                <div className="h-1 w-10 bg-form-strokedark rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default LoadingProducts;
