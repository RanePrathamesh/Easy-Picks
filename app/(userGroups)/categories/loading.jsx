import React from 'react'

const LoadingCategories = () => {
    const numLoadingItems = 6;
  return (
    <>
    <div className="animate-pulse md:h-26 h-10 w-full relative lg:pl-52 pl-5  md:py-7 py-11 mb-5 bg-shady  ">
        <div className="h-1.5 bg-gray-200 rounded-full bg-gray-2 lg:w-[830px] md:w-[400px] w-[150px] md:my-4 mb-4 md:mb-0"></div>
      </div>
    <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-10 sm:px-2 md:my-10 my-5">
        {[...Array(numLoadingItems)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-white h-[356px] w-[367px] rounded-lg"
          >
            <div className="flex space-x-3 p-4">
                <div className="w-10 h-10 bg-meta-2 rounded-lg"></div>
                <div className="w-46 h-2 bg-black opacity-50 mt-3 rounded-full"></div>
            </div>
            <div className="w-full  h-0.5 bg-black-2"></div>
          </div>
        ))}
            
      </div>
    </>
  )
}

export default LoadingCategories
