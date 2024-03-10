import React from 'react'

const LoadingSubCats = () => {
    const numLoadingItems = 3;
  return (
    <>
    <div className="animate-pulse md:h-26 h-10 w-full relative lg:pl-52 pl-5  md:py-7 py-11 mb-5 bg-shady  ">
        <div className="h-1.5 bg-gray-200 rounded-full bg-gray-2 lg:w-[830px] md:w-[400px] w-[150px] md:my-4 mb-4 md:mb-0"></div>
      </div>
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
    </>
  )
}

export default LoadingSubCats
