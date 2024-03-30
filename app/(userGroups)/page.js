import Catalogue from "@/components/Catalogue";
import Collect from "@/components/collects/Collect";
import Link from "next/link";


export const metadata = {
  title: "Best Reviewed Products",
  description: "Discover the top 10 bestselling products from Amazon's extensive catalog. Find the latest deals and compare prices for the best value.",
  keywords: "bestselling products, top 10, Amazon, deals, prices, reviews",
};


export default async function Home() {
  return (
    <div>
      <Collect />
      <section className="w-full flex-center pt-2">
        <h1 className="font-bold text-xl text-center">
          hey!!! pick Best Products At Lowest Price<br />
          <span className="text-center">Amazon Products</span>
        </h1>
        <p className="text-center my-3 italic">"Grab your deal today!"</p>
        <div className="text-center mt-4">
          <Link href="/admin/categories" className="inline-block bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105" >
            
              Start Searching
            
          </Link>
        </div>
      </section>
      <section className="container mx-auto py-8">
        <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
        <div className="grid grid-cols-3 gap-4">
          {/* Product Cards */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <img src="/product1.jpg" alt="Product 1" className="w-full h-32 object-cover mb-4" />
            <h3 className="text-lg font-semibold mb-2">Product 1</h3>
            <p className="text-gray-600">Description of Product 1.</p>
            <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Add to Cart
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <img src="/product2.jpg" alt="Product 2" className="w-full h-32 object-cover mb-4" />
            <h3 className="text-lg font-semibold mb-2">Product 2</h3>
            <p className="text-gray-600">Description of Product 2.</p>
            <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Add to Cart
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <img src="/product3.jpg" alt="Product 3" className="w-full h-32 object-cover mb-4" />
            <h3 className="text-lg font-semibold mb-2">Product 3</h3>
            <p className="text-gray-600">Description of Product 3.</p>
            <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Add to Cart
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
