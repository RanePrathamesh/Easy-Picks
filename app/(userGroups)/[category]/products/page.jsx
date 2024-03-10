// import { getCategoryNameById } from "@/controllers/general";
import Catalogue from "@/components/Catalogue";
export async function generateMetadata({ params, searchParams }) {
  const decodedCategoryName = decodeURIComponent(params.category);

  return {
    title: `Top 10 Products in ${decodedCategoryName}`,
    description: `Explore the top 10 products in the ${
        decodedCategoryName
    } category. View the most recently updated data and use the sortable list to find the best products for your needs. Filter: ${
      searchParams.filter || "All"
    }.`,
    keywords: `${
        decodedCategoryName
    }, top 10 products, recently updated, sortable list, filter: ${
      searchParams.filter || "All"
    }`,
  };
}

const Page = ({ params,searchParams }) => {
 const slug= decodeURIComponent(params.category)
  return (
    <>
      <Catalogue slug={slug} filter={searchParams.filter} />
    </>
  );
};

export default Page;
