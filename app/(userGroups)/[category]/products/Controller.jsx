import Image from "next/image";
import { getProducts } from "@/controllers/general";
import Advertisment from "@/components/modals/advertisement/Advertisment";
import ProductBar from "@/components/ProductBar";

const Controller = async ({slug, filter}) => {
    const { allProducts } = await getProducts(slug, filter);
  return (
    <>
      {allProducts[0] && <Advertisment product={allProducts[0]} />}
      <div className=" w-full py-6 lg:max-w-5xl lg:px-0 px-7">
        {allProducts.length > 0 ? (
          allProducts.map((product, index) => (
            <ProductBar key={product._id} rank={index} product={product} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-10">
            <p className="text-graydark font-bold text-xl  mb-4 text-center">
              No Products Found !
            </p>
            <div className="relative w-40 h-40">
              <Image
                src="/box.jpg"
                layout="fill"
                objectFit="contain"
                objectPosition="center"
                alt="Empty"
                className="  mix-blend-darken "
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Controller;
