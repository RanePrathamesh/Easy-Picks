import { httpAxios } from "@/utils/httpHelper";

export const createUser = async function () {
  const { data } = await httpAxios.post("/api/users");
  return data;
};

export const getUsers = async function () {
  const { data } = await httpAxios.get("/api/users");
  return data;
};
export const resetPassword = async function (email) {
  const {data} = await httpAxios.post('/api/resetCheck',{email});
  console.log(data);
  return data
}
