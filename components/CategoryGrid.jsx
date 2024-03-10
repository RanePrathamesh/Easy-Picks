import Link from "next/link";
import Image from "next/image";

const CategoryGrid = ({ categories }) => {
  return (
    <div className="md:mx-40 mx-5 my-10  grid md:grid-cols-2 lg:grid-cols-3 gap-10">
      {categories && categories.length > 0 && (
        categories.map((category, i) => {
          return (
            <div key={i} className="col-span-1 flex bg-white py-4 px-6 rounded-lg items-center space-x-6">
              <Image
                src="/categorySample.webp"
                width={50}
                height={50}
                alt="Cate-Image"
              />
              <Link
                href="/[category]/products"
                as={`/${category._id}/products`}
              >
                <h2 className="btn  text-base font-semibold text-graydark font-inter ">
                  {category.categoryName}
                </h2>
              </Link>
            </div>
          );
        })
      ) }
    </div>
  );
};

export default CategoryGrid;
