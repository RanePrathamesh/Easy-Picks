import { httpAxios } from "@/utils/httpHelper";

export const addTaskInSchedule=async function(taskData){
    if(!taskData) return;
   const {data}=await httpAxios.post("/api/cron",taskData);
   return data;
}

export const getCronTasks=async function(){
    const {data}=await httpAxios.get("/api/cron");
    return data;
}
export const deleteCronTask=async function(id){
    const {data}=await httpAxios.delete(`/api/cron?id=${id}`);
    return data;
}

export const toggleCronStatus=async function(id){
    const {data}=await httpAxios.put(`/api/cron?id=${id}`);
    return data;
}