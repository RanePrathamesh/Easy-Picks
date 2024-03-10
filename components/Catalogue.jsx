import Banner from "./Banner";
import { getCategoryDetail, getProducts } from "@/controllers/general";
import FilterBox from "./filterBox";
import Controller from "@/app/(userGroups)/[category]/products/Controller";

const Catalogue = async ({ slug, filter }) => {
  const data = await getCategoryDetail(slug);
  !filter ? (filter = "toprelevant") : filter;
  
  return (
    <>
      {data && data.categoryName && (
        <Banner
          text={`10 Best ${data.categoryName} Products`}
          lastUpdated={data.lastUpdated}
          children={
            <div className="absolute lg:right-60 right-10 bottom-5 ">
              <FilterBox filter={filter} />
            </div>
          }
        />
      )}
      <Controller slug={slug} filter={filter} />
    </>
  );
};

export default Catalogue;
