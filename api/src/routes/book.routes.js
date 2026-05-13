import { Router } from "express";
import * as bookController  from "../controllers/book.controller.js";
import { validateApiKey } from "../middlewares/apiKey.middleware.js";

const router = Router();

router.post("/",  bookController.createBook);
router.get("/", validateApiKey, bookController.getAllBooks);
router.get("/:id", validateApiKey, bookController.getBookById);
router.put("/:id",  bookController.updateBook);
router.delete("/:id", bookController.deleteBook);

export default router;