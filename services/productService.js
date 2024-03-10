import { httpAxios } from "@/utils/httpHelper";

export async function getProducts(filter={}){
  let query=""
  if(Object.keys(filter).length){
    let filterkey=Object.keys(filter)
    for(const key of filterkey){
      if(filter[key])  query+=`${key}=${filter[key]}&`
    }
  }

  let {data}=await  httpAxios.get(`/api/products?${query}`);
  return data
}

export async function getProductDetails(productId){
  let {data}=await  httpAxios.get("/api/products/"+productId);
  return data
}

export async function updateProduct({productId,title,description,category}){
    let {data}=await  httpAxios.put("/api/products/"+productId,{
      title,description,categoryId:category
    });
    return data
}
export async function deleteProduct(productId){
    let {data}=await  httpAxios.delete("/api/products/"+productId);
    return data
}

export async function scrapeProduct(productId){
  let {data}=await  httpAxios.get("/api/products/scrape/"+productId);
  return data
}