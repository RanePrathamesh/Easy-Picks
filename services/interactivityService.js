import { httpAxios } from "@/utils/httpHelper";

export async function setCookiesForCollect(visitId){
    let {data}=await httpAxios.get("/api/collect/homePage-collect");
    return data
}

export async function collectHomePageData({visitId,currentUrl}){
    let {data}=await httpAxios.post("/api/collect/homePage-collect",{
       body: JSON.stringify({visitId:visitId,currentUrl})
    });
    return data
}

export async function collectCategoryPageData({visitId,currentUrl}){
    let {data}=await httpAxios.post("/api/collect/categoryPage-collect",{
       body: JSON.stringify({visitId:visitId,currentUrl})
    });
    return data
}

export async function collectProductClickData(productData){
    let {data}=await httpAxios.post("/api/collect/productClick-collect",{
        body:productData
    });
    return data
}
export async function collectCategoryClickData(product){
    let {data}=await httpAxios.post("/api/collect/category-collect",{
        body:product
    });
    return data
}