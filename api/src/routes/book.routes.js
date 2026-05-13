import { Router } from "express";
import * as bookController  from "../controllers/book.controller.js";
import { validateApiKey } from "../middlewares/apiKey.middleware.js";

const router = Router();

router.post("/", validateApiKey, bookController.createBook);
router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getBookById);
router.put("/:id", validateApiKey, bookController.updateBook);
router.delete("/:id", validateApiKey, bookController.deleteBook);

export default router;