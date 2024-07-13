import axios from "axios";

// const BASE_URL = "http:localhost:5000/api/";
const BASE_URL = "http://192.168.1.6:5000/api/";

export const makeRequest = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
