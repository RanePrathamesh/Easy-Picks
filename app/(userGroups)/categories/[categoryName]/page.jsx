import Banner from "@/components/Banner";
import { getSubCategories } from "@/controllers/general";
import CategoryGrid from "@/components/CategoryGrid";
export async function generateMetadata({ params }) {
  const decodedCategoryName = decodeURIComponent(params.categoryName);
  return {
    title: `Explore ${decodedCategoryName} Subcategories`,
  description: `Discover a variety of subcategories under ${decodedCategoryName}. Explore the expanded range of options available for your needs and interests.`,
  keywords: `${decodedCategoryName}, subcategories, variety, selection`,
  };
}

const Page = async ({ params }) => {
  const decodedCategoryName = decodeURIComponent(params.categoryName);
  const { subCategories } = await getSubCategories(decodedCategoryName);
  
  return (
    <>
    
      <Banner text={decodedCategoryName} />
      <CategoryGrid categories={subCategories} />
    </>
  );
};

export default Page;
