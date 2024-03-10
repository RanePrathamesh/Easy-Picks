import CategoryComponent from "@/components/Category";
import Collect from "@/components/collects/Collect";

export const metadata = {
  title: "Explore Our Catalog",
  description: "Browse through a wide range of product categories in our extensive catalog. Find the perfect items for your needs and interests.",
  keywords: "product categories, catalog, shopping, variety, selection",
};

const  Categories = async() => {
  return (
      <>
       <Collect/>
      <CategoryComponent />
      </>
  );
};

export default Categories;
