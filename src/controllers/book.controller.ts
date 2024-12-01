import { Request, Response } from "express";
import * as BookService from "../services/book.service";
import asyncHandler from "../middlewares/asyncHandler";

// @desc Listing Books
// @route GET /books
export const listBooks = asyncHandler(async (req: Request, res: Response) => {
  const books = await BookService.listBooks();
  res.status(200).json({
    name: "Getting book list",
    message: "Books fetched successfully",
    books: books 
  });
});

// @desc Accessing information about a book (name and average rating)
// @route GET /books/:id
export const getBookDetails = asyncHandler(async (req: Request, res: Response) => {
  const bookId = Number(req.params.id);

  const bookDetails = await BookService.getBookDetails(bookId);

  res.status(200).json({
    name:"Getting a book with its rating", 
    message: "Book details fetched successfully",
    book: bookDetails,
  });
});

// @desc Creating a new book
// @route POST /books
export const createBook = asyncHandler(async (req: Request, res: Response) => {
  const { title, author } = req.body;
  const newBook = await BookService.createBook(title, author);

  res.status(201).json({
    name:"Creating a book",
    message: "Book created succesfully",
    book: newBook,
  });
});
