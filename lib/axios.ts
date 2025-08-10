import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001",
});

// Axios Interceptor: Har request bhejne se pehle yeh function chalega
axiosInstance.interceptors.request.use(
  (config) => {
    // Check karein ki code browser mein chal raha hai ya nahi
    if (typeof window !== "undefined") {
      // LocalStorage se 'userInfo' get karein
      const userInfoString = localStorage.getItem("userInfo");

      if (userInfoString) {
        // 'userInfo' ko parse karke token nikalein
        const userInfo = JSON.parse(userInfoString);
        const token = userInfo?.token;

        // Agar token hai, to use headers mein add karein
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
