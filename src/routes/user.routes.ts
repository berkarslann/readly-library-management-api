import express from "express";
import { borrowBook, createUser, getUserDetails, listUsers, returnBook } from "../controllers/user.controller";
import { validateTransaction, validateUser } from "../middlewares/validationHandler";

const router = express.Router();

router.get("/",  listUsers);
router.get("/:id", getUserDetails);
router.post("/", validateUser, createUser);
router.post("/:userId/borrow/:bookId", validateTransaction, borrowBook);
router.post("/:userId/return/:bookId", validateTransaction, returnBook);

export default router;