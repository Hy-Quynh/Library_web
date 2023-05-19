import axiosConfig from "../axiosConfig";

const URL = "/api/book";

export const bookAPI = {
  getAllBook: async () => {
    const response = await axiosConfig.get(`${URL}`);
    return response;
  },
  deleteBook: async (bookId) => {
    const response = await axiosConfig.delete(`${URL}/${bookId}`);
    return response;
  },
  createBook: async (book) => {
    const response = await axiosConfig.post(`${URL}`, book);
    return response;
  },

  updateBook: async (book, bookId) => {
    const response = await axiosConfig.put(`${URL}/${bookId}`, book);
    return response;
  },

  getBookById: async (bookId) => {
    const response = await axiosConfig.get(`${URL}/${bookId}`);
    return response;
  },
};
