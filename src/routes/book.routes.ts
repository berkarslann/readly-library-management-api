import express from "express";
import { createBook, getBookDetails, listBooks } from "../controllers/book.controller";
import { validateBook } from "../middlewares/validationHandler";

const router = express.Router();

router.get("/", listBooks)
router.post("/", validateBook, createBook);
router.get("/:id", getBookDetails);

export default router;