import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_SITE_URL + "/api";
export const baseURLService = process.env.NEXT_API_SERVICE_URL + "/api";
// const baseURL =" http://localhost:3000/api"; 
// export const baseURLService =  " http://localhost:8000/api";


export const api = axios.create({
  baseURL,
});

api.interceptors.response.use(
  function (response) {
    // Do something with the response data
    return response;
  },
  function (error) {
    // Handle the response error
    if (error.response && error.response.status === 401) {
      // redirect("/auth/login");
      window.location.replace("/auth/login");
      // Perform any logout actions or redirect to login page
    }
    return Promise.reject(error);
  }
);

export const apiServices = axios.create({
  baseURL: baseURLService,
});
