import { Router } from "express";
import * as bookController  from "../controllers/book.controller.js";

const router = Router();

router.post("/create", bookController.createBook);
router.get("/books", bookController.getAllBooks);
router.get("/books/:id", bookController.getBookById);
router.put("/update/:id", bookController.updateBook);
router.delete("/delete/:id", bookController.deleteBook);


export default router;