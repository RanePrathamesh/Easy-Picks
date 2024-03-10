import { httpAxios } from "@/utils/httpHelper";

export async function saveEmailForNewsletter(email, interest,pathname){
    let { data } = await httpAxios.post("/api/newsletter", {
        email,
        interest,
        pathname
      });
    return data
}

export async function unsubscribeForNewsletter(email){
  let { data } = await httpAxios.put("/api/newsletter", {
      email
    });
  return data
}