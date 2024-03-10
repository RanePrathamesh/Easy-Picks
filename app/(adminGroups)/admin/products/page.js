import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Products from "./product";

export const metadata = {
    title: "Products Page | Next.js E-commerce Dashboard Template",
    description: "This is Tables page for TailAdmin Next.js",
    // other metadata
};

const ProductsPage = () => {
    return (
        <div >
            <Breadcrumb pageName="Products" />
            <Products/>
        </div>
    );
};

export default ProductsPage;
