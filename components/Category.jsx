import Link from "next/link";
import Banner from "./Banner";
import { getAllCategories } from "@/controllers/general";
import Image from "next/image";

const CategoryComponent = async () => {
  const { allCategories, error } = await getAllCategories();

  function generateCategoryStructure(parentCategory) {
    const subcategories = allCategories.filter(
      (category) => category.parentCategory === parentCategory
    );

    let displayedSubcategories = 0;

    return (
      <div className="category-box">
        {subcategories.map((category) => {
          if (displayedSubcategories < 6) {
            displayedSubcategories++;
            return (
              <div key={category._id} className="" >
                <Link
                  href={`/${encodeURI(category.slug)}/products`}
                >
                  <h2 className=" text-base py-1.5 ">{category.categoryName}</h2>
                </Link>
                {generateCategoryStructure(category._id)}
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
    );
  }

  const topLevelCategories = allCategories.filter(
    (category) => category.parentCategory === null
  );

  return (
    <>
      <Banner text={'Categories'} />
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-10 sm:px-2 md:my-10 my-5">
        {topLevelCategories.length > 0 ? (
          topLevelCategories.map((category) => (
            <div
              key={category._id}
              className="col-span-1 bg-white w-full p-2 rounded-lg"
            >
              <div className="flex pb-3 border-b-2 border-gray-200">
                <Image
                  src="/category-icon.png"
                  width={50}
                  height={50}
                  alt="Image"
                  className="px-1 py-1 mx-2"
                />
                <Link
                  href={`/${category.slug}/products`}
                >
                  <h2 className="btn p-3 text-lg text-graydark font-sans font-bold">
                    {category.categoryName}
                  </h2>
                </Link>
              </div>
              {generateCategoryStructure(category._id)}
              <Link href={`categories/${category.categoryName}`} className="text-center block bg-meta-2 rounded py-1 ">Show more</Link>
            </div>
          ))

        ) : (
          <div>No categories found.</div>
        )}
      </div>
    </>
  );
};

export default CategoryComponent;
