import axios from "axios";

const axiosApiInstance = axios.create({
  validateStatus: function (status) {
    const valid = [200, 201, 204];
    return valid.includes(status);
  },
});

// Request interceptor for API calls
axiosApiInstance.interceptors.request.use(
  async (config: any) => {
    const user = localStorage.getItem("currentUser") ?? undefined;

    if (user) {
      config.headers["Authorization"] = user;
    }

    return config;
  },
  (error: any) => {
    Promise.reject(error);
  }
);

export default axiosApiInstance;
