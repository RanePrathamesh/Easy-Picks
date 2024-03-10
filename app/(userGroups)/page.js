import Catalogue from "@/components/Catalogue";
import Collect from "@/components/collects/Collect";
import Link from "next/link";

export const metadata = {
  title: "Best Reviewed Products",
  description: "Discover the top 10 bestselling products from Amazon's extensive catalog. Find the latest deals and compare prices for the best value.",
  keywords: "bestselling products, top 10, Amazon, deals, prices, reviews",
};


export default async function Home() {
//  await cronJob()
// await viewCronJob()

return (
  <>
    <Collect />
    <section className="w-full  flex-center pt-2 ">
      <h1 className="font-bold text-xl text-center">
        Best Reviewed At Lowest Price<br />
        <span className=" text-center">Amazon Products</span>
      </h1>
      <p className=" text-center my-3 italic ">"Grab your deal today!"</p>
      <div className="text-center mt-4">
        <Link href="/admin/categories">
          Start Searching
        </Link>
      </div>
    </section>
  </>
);
}
