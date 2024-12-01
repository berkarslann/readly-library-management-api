import { AppDataSource } from "../config/db";
import { Book } from "../models/book.model";
import { Transaction } from "../models/transaction.model";
import { User } from "../models/user.model";
import { CustomError } from "../middlewares/errorHandler";
import { IsNull } from "typeorm";

const userRepository = AppDataSource.getRepository(User);
const bookRepository = AppDataSource.getRepository(Book);
const transactionRepository = AppDataSource.getRepository(Transaction);

export const borrowBook = async (userId: number, bookId: number) => {
  const user = await userRepository.findOneBy({ id: userId });
  if (!user) {
    throw new CustomError("User not found", 404);
  }
  const book = await bookRepository.findOneBy({ id: bookId });
  if (!book) {
    throw new CustomError("Book not found", 404);
  }
  if (!book.isAvailable) {
    throw new CustomError("The book is currently unavailable", 409);
  }
  const transaction = transactionRepository.create({
    user,
    book,
    borrowDate: new Date(),
  });
  book.isAvailable = false;

  await transactionRepository.save(transaction);
  await bookRepository.save(book);
};

export const returnBook = async (
  userId: number,
  bookId: number,
  rating: number
) => {
  const user = await userRepository.findOneBy({ id: userId });
  if (!user) {
    throw new CustomError("User not found", 404);
  }
  const book = await bookRepository.findOneBy({ id: bookId });
  if (!book) {
    throw new CustomError("Book not found", 404);
  }
  if (isNaN(rating) || rating < 0 || rating > 10) {
    throw new CustomError("Rating must be a number between 0 and 10", 400);
  }

  const transaction = await transactionRepository.findOne({
    where: { user: { id: userId }, book: { id: bookId }, returnDate: IsNull() },
    relations: ["book"],
  });
  if (!transaction) {
    throw new CustomError(
      "This book cannot be returned because it was not borrowed by the specified user.",
      404
    );
  }

  transaction.returnDate = new Date();
  transaction.rating = rating;

  const previousTotalRatings = book.totalRatings;
  const previousRatingCount = book.ratingCount;

  const newTotalRatings = previousTotalRatings + rating;
  const newRatingCount = previousRatingCount + 1;
  const newAverageRating = newTotalRatings / newRatingCount;

  book.totalRatings = newTotalRatings;
  book.ratingCount = newRatingCount;
  book.rating = newAverageRating;
  book.isAvailable = true;

  await transactionRepository.save(transaction);
  await bookRepository.save(book);
};
