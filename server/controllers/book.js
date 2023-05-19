const asyncHandler = require("express-async-handler");
const {
  getAllBook,
  getTotalBook,
  createBookData,
  updateBookData,
  deleteBookData,
  getBookById,
} = require("../models/book");

module.exports = {
  getAllBook: asyncHandler(async (req, res) => {
    const { limit, offset } = req?.query;
    const book = await getAllBook(limit, offset);
    const totalBook = await getTotalBook();
    res.send({ success: true, payload: { book: book, total: totalBook } });
  }),

  getBookById: asyncHandler(async (req, res) => {
    const { bookId } = req?.params;
    const book = await getBookById(bookId);
    res.send({ success: true, payload: book });
  }),

  createNewBook: asyncHandler(async (req, res) => {
    const bookData = req.body;
    const createRes = await createBookData(bookData);
    res.send({ success: createRes });
  }),

  updateBookData: asyncHandler(async (req, res) => {
    const bookData = req.body;
    const { bookId } = req.params;

    const updateRes = await updateBookData(bookData, bookId);
    res.send({ success: updateRes });
  }),

  deleteBookData: asyncHandler(async (req, res) => {
    const { bookId } = req.params;
    const deleteRes = await deleteBookData(bookId);
    res.send({ success: deleteRes });
  }),
};
