import api from "../../api/client";


export const loginRequest = async (data) => {
  const res = await api.post("/auth/login", data);
  console.log(res);
  return res.data;
};
export const registerRequest = async (data) =>{
  const res= await api.post("/auth/register", data);
  console.log(res.data);
  return res.data;
}