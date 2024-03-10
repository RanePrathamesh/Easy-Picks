import { saveProductsOfXCategory } from "@/methods";
import { createBrowserAndPage, ExtractProductLiknsAndExecute } from "@/app/lib/Scraper/scrapers";
import NextJsResponse from "@/app/lib/NextResponse";
import Category from "@/models/category";

export const GET = async (req, res) => {
  try {
    const browserContext=await createBrowserAndPage()

  const url = new URL(req.url);
  const link = url.searchParams.get("link");
  const categoryID = url.searchParams.get("categoryID");
  let products = await ExtractProductLiknsAndExecute(browserContext.browser, browserContext.newPage, link);

  const category=await Category.findById(categoryID);
  if(!category) throw new Error("category not found");
  category.status="complete";
  await category.save()

  if (products?.length > 0) {
    await saveProductsOfXCategory(products, categoryID);
    return NextJsResponse({success:true,message: "All Products Scraped Successfully and Stored in Database"})
  }
  return NextJsResponse({success:true,message: "category has not any products"})
  } catch (error) {
      return NextJsResponse({success:false,message:"Failed to execute Links Of category."}) 
  }
}
export const PUT = async (req, res) => {
  try {
  const url = new URL(req.url);
  const link = url.searchParams.get("link");
  const categoryID = url.searchParams.get("categoryID");
  const category=await Category.findById(categoryID);
    if(!category) throw new Error("category not found");
    category.status="running";
    await category.save()
    return NextJsResponse({success:true,message:"running"}) 
  } catch (error) {
    console.log(error)
      return NextJsResponse({success:false,message:error.message}) 
  }

}


