import { httpAxios } from "@/utils/httpHelper";

export async function getCategories(){
    let {data}=await httpAxios.get("/api/categories");
    return data
}

export async function categoriesWithProdCount(filter={}){
    let query=""
    if(Object.keys(filter).length){
      let filterkey=Object.keys(filter)
      for(const key of filterkey){
      if(filter[key])  query+=`${key}=${filter[key]}&`
      }
    }
    const { data } = await httpAxios.get(`/api/category?${query}`)
    return data
}