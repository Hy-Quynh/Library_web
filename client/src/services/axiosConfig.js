import axios from "axios";
import { parse, stringify } from "qs";

const defaultHeader = {
  "Content-Type": "application/json",
};
const axiosConfig = axios.create({
  baseURL: 'http://localhost:5005',
  headers: defaultHeader,
  paramsSerializer: {
    encode: parse,
    serialize: stringify,
  },
});

axiosConfig.interceptors.request.use(async (config) => {
  return config;
});

axiosConfig.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }

    return response;
  },
);
export { defaultHeader };

export default axiosConfig;
