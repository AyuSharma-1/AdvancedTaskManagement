import axios from "axios";

export const registerUser = (data) => {
  return axios.post("/api/v1/user/register", data);
};

export const loginUSer = (data) => {
  return axios.post("/api/v1/user/login", data);
};

export const forgotPassword=(email)=>{
  return axios.post(`/api/v1/user/forgot-password`,{email});
}

export const resetPassword = (token, password)=> {
  return axios.post(`/api/v1/user/reset-password/${token}`, {password})
}
const AuthServices = { registerUser, loginUSer, forgotPassword, resetPassword };

export default AuthServices;
