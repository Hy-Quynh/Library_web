import axiosConfig from "../axiosConfig";

const URL = "/api/auth";

export const authAPI = {
  login: async (data) => {
    const response = await axiosConfig.post(`${URL}/login`, data);
    return response;
  },
  signup: async (data) => {
    const response = await axiosConfig.post(`${URL}/signup`, data);
    return response;
  },
};
