import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000", 
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, 
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error);

    // Here you can add global toast notification for errors if you want
    // toast.error(error?.response?.data?.message || "Something went wrong!");

    return Promise.reject(error);
  }
);
