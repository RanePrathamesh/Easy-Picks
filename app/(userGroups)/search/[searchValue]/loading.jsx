import React from "react";

const LoadingSearchResult = () => {
  const numLoadingItems = 3;
  const numLoadingProds = 4;
  return (
    <>
      <div>
        <section className="border-b-stroke border-b-4  ">
          <div className="md:mx-40 mx-5 my-10  grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[...Array(numLoadingItems)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse col-span-1 flex bg-white py-4 px-6 rounded-lg items-center space-x-6"
              >
                <div className="md:w-[50px] w-[35px] h-[50px] bg-meta-2 rounded-lg"></div>
                <div className="w-35  h-2 bg-black opacity-50  rounded-full"></div>
              </div>
            ))}
          </div>
        </section>

        <section className=" mx-5 md:mx-40 mt-10  grid lg:grid-cols-2 gap-10 justify-items-center">
        {[...Array(numLoadingProds)].map((_, index) => (
          <div key={index} className="bg-white w-full grid grid-cols-3 rounded-xl justify-items-center">
            <div className="p-3 grid grid-cols-1 gap-5">
              <div className="md:w-[100px] w-[80px] md:h-[100px] h-[80px] bg-meta-2"></div>

              <div className="rounded-lg w-[100px] h-4  bg-primary"></div>
            </div>
            <div className="pt-5 ">
              <div className="h-4/5 justify-items-start mb-2">
                <div className="md:w-[150px] w-[90px] h-[15px] bg-black-2 opacity-25 rounded-full mb-2" />
                <div className="md:w-[130px] w-[80px] h-[15px] bg-black-2 opacity-25 rounded-full mb-2" />
                <div className="md:w-[50px] w-[30px] h-[15px] bg-boxdark opacity-50 rounded-full mb-2" />
              </div>
            </div>
            <div className="md:w-[60px] md:h-[45px] bg-meta-2  mr-5 rounded-b-lg" />
          </div>
        ))}
        </section>
      </div>
    </>
  );
};

export default LoadingSearchResult;
