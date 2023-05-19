const express = require("express");
const bookController = require("../controllers/book");
const router = express.Router();

router.get("/", bookController.getAllBook);
router.post("/", bookController.createNewBook);
router.put("/:bookId", bookController.updateBookData);
router.delete("/:bookId", bookController.deleteBookData);
router.get("/:bookId", bookController.getBookById);

module.exports = router;
