import { Request, Response } from "express";
import * as UserService from "../services/user.service";
import * as TransactionService from "../services/transaction.service";
import asyncHandler from "../middlewares/asyncHandler";

// @desc Listing Users
// @route GET /users
export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await UserService.listUsers();
  res.status(200).json({
    name: "Getting user list with ids, names and emails",
    users: users,
  });
});

// @desc Accessing information about a user (name, books borrowed in the past with their user scores, and currently borrowed books)
// @route GET /users/:id
export const getUserDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const userDetails = await UserService.getUserDetails(userId);
    res.status(200).json({
      name: "Getting a user with his past and current book borrow list",
      user: userDetails,
    });
  }
);

// @desc Creating a new user
// @route POST /users
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const newUser = await UserService.createUser(name, email);
  res.status(201).json({
    name: "Creating a user",
    message: "User created successfully",
    user: newUser,
  });
});

// @desc Borrow book
// @route POST /users/:userId/borrow/:bookId
export const borrowBook = asyncHandler(async (req: Request, res: Response) => {
  const { userId, bookId } = req.params;

  await TransactionService.borrowBook(Number(userId), Number(bookId));

  res.status(200).json({
    message: "Book borrowed successfully",
  });
});

// @desc Return book
// @route POST /users/:userId/return/:bookId
export const returnBook = asyncHandler(async (req: Request, res: Response) => {
  const { userId, bookId } = req.params;
  const { rating } = req.body;

  await TransactionService.returnBook(
    Number(userId),
    Number(bookId),
    Number(rating)
  );
  res.status(200).json({
    message: "Book returned and rated successfully",
  });
});
