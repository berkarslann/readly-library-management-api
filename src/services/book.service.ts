import { AppDataSource } from "../config/db";
import { CustomError} from "../middlewares/errorHandler";
import { Book } from "../models/book.model";

const bookRepository = AppDataSource.getRepository(Book);

export const listBooks = async () => {
  const books = await bookRepository.find();
  return books;
};

export const getBookDetails = async (bookId: number) => {
  const book = await bookRepository.findOne({
    where: { id: bookId },
  });
  if (!book) {
    throw new CustomError("Book not found", 404);
  }
  return book;
};

export const createBook = async (title: string, author: string) => {
  const existingBook = await bookRepository.findOneBy({ title });
  if (existingBook) {
    throw new CustomError("Book already exists.", 409);
  }
  const book = bookRepository.create({ title, author });
  return await bookRepository.save(book);
};
