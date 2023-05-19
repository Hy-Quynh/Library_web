const { mysql } = require("../config/mysql");
const { getByLimitAndOffset } = require("../utils/helpers");

module.exports = {
  getAllBook: async (limit, offset) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const bookData = await mysql.query(
        `SELECT b.* FROM books b ORDER BY _id DESC ${limitOffset}`
      );
      return bookData || [];
    } catch (error) {
      console.log("getAllBook error >>>> ", error);
      return [];
    }
  },

  getTotalBook: async () => {
    try {
      const total = await mysql.query(
        `SELECT COUNT(_id) as count_book FROM books`
      );
      return total?.length ? total?.[0]?.count_book : 0;
    } catch (error) {
      console.log("getTotalBook error >>>> ", error);
      return 0;
    }
  },

  createBookData: async (bookData) => {
    try {
      const {
        title,
        author,
        description,
        release_date,
        page,
        category,
        image,
      } = bookData;
      const createRes = await mysql.query(
        `INSERT INTO books(title, author, description, release_date, page, category, image, created_day) 
        VALUES('${title}', '${author}', '${description}', date('${new Date(
          release_date
        )
          .toISOString()
          .replace("Z", "")}'), ${Number(
          page
        )}, '${category}', '${image}', Now())`
      );
      return createRes ? true : false;
    } catch (error) {
      console.log("createBookData error >>>> ", error);
      return false;
    }
  },

  updateBookData: async (bookData, bookId) => {
    try {
      const {
        title,
        author,
        description,
        release_date,
        page,
        category,
        image,
      } = bookData;

      const updateRes = await mysql.query(
        `UPDATE books SET title='${title}', author='${author}', description='${description}', release_date=date('${new Date(
          release_date
        )
          .toISOString()
          .replace("Z", "")}'),
        page=${Number(page)}, category='${category}', image='${image}'
         WHERE _id=${Number(bookId)}`
      );
      return updateRes ? true : false;
    } catch (error) {
      console.log("updateBookData error >>>> ", error);
      return false;
    }
  },

  deleteBookData: async (bookId) => {
    try {
      const deleteRes = await mysql.query(
        `DELETE FROM books WHERE _id=${Number(bookId)}`
      );
      return deleteRes ? true : false;
    } catch (error) {
      return false;
    }
  },

  getBookById: async (bookId) => {
    try {
      const response = await mysql.query(
        `SELECT * FROM books WHERE _id=${Number(bookId)}`
      );
      return response?.[0] || {};
    } catch (error) {
      return {};
    }
  },
};
