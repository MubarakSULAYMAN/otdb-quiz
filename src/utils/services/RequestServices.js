import axios from "axios";

const apiClient = axios.create({
    baseURL: `https://opentdb.com`,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
