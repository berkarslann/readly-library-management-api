import { borrowBook, returnBook } from '../src/services/transaction.service'
import { AppDataSource } from "../src/config/db";
import { User } from "../src/models/user.model";
import { Book } from "../src/models/book.model";
import { Transaction } from "../src/models/transaction.model";
import { CustomError } from "../src/middlewares/errorHandler";

jest.mock("../../src/config/db");

const mockUserRepository = {
  findOneBy: jest.fn(),
};
const mockBookRepository = {
  findOneBy: jest.fn(),
  save: jest.fn(),
};
const mockTransactionRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
};

(AppDataSource.getRepository as jest.Mock).mockImplementation((model) => {
  if (model === User) return mockUserRepository;
  if (model === Book) return mockBookRepository;
  if (model === Transaction) return mockTransactionRepository;
  throw new Error("Unexpected model");
});

describe("Book Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("borrowBook", () => {
    it("should throw an error if user is not found", async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(borrowBook(1, 1)).rejects.toThrow(CustomError);
      await expect(borrowBook(1, 1)).rejects.toThrow("User not found");
    });

    it("should throw an error if book is not found", async () => {
      mockUserRepository.findOneBy.mockResolvedValue({ id: 1 });
      mockBookRepository.findOneBy.mockResolvedValue(null);

      await expect(borrowBook(1, 1)).rejects.toThrow(CustomError);
      await expect(borrowBook(1, 1)).rejects.toThrow("Book not found");
    });

    it("should throw an error if the book is unavailable", async () => {
      mockUserRepository.findOneBy.mockResolvedValue({ id: 1 });
      mockBookRepository.findOneBy.mockResolvedValue({ id: 1, isAvailable: false });

      await expect(borrowBook(1, 1)).rejects.toThrow(CustomError);
      await expect(borrowBook(1, 1)).rejects.toThrow("The book is currently unavailable");
    });

    it("should create a transaction and update book availability", async () => {
      const mockUser = { id: 1 };
      const mockBook = { id: 1, isAvailable: true };

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockBookRepository.findOneBy.mockResolvedValue(mockBook);
      mockTransactionRepository.create.mockReturnValue({});
      mockTransactionRepository.save.mockResolvedValue({});
      mockBookRepository.save.mockResolvedValue({});

      await borrowBook(1, 1);

      expect(mockTransactionRepository.create).toHaveBeenCalledWith({
        user: mockUser,
        book: mockBook,
        borrowDate: expect.any(Date),
      });
      expect(mockTransactionRepository.save).toHaveBeenCalled();
      expect(mockBookRepository.save).toHaveBeenCalledWith({
        ...mockBook,
        isAvailable: false,
      });
    });
  });

  describe("returnBook", () => {
    it("should throw an error if user is not found", async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(returnBook(1, 1, 5)).rejects.toThrow(CustomError);
      await expect(returnBook(1, 1, 5)).rejects.toThrow("User not found");
    });

    it("should throw an error if book is not found", async () => {
      mockUserRepository.findOneBy.mockResolvedValue({ id: 1 });
      mockBookRepository.findOneBy.mockResolvedValue(null);

      await expect(returnBook(1, 1, 5)).rejects.toThrow(CustomError);
      await expect(returnBook(1, 1, 5)).rejects.toThrow("Book not found");
    });

    it("should throw an error if rating is invalid", async () => {
      mockUserRepository.findOneBy.mockResolvedValue({ id: 1 });
      mockBookRepository.findOneBy.mockResolvedValue({ id: 1 });

      await expect(returnBook(1, 1, -1)).rejects.toThrow(CustomError);
      await expect(returnBook(1, 1, -1)).rejects.toThrow("Rating must be a number between 0 and 10");
    });

    it("should throw an error if transaction does not exist", async () => {
      mockUserRepository.findOneBy.mockResolvedValue({ id: 1 });
      mockBookRepository.findOneBy.mockResolvedValue({ id: 1 });
      mockTransactionRepository.findOne.mockResolvedValue(null);

      await expect(returnBook(1, 1, 5)).rejects.toThrow(CustomError);
      await expect(returnBook(1, 1, 5)).rejects.toThrow(
        "This book cannot be returned because it was not borrowed by the specified user."
      );
    });

    it("should update transaction and book ratings", async () => {
      const mockUser = { id: 1 };
      const mockBook = { id: 1, totalRatings: 10, ratingCount: 2, rating: 5 };
      const mockTransaction = { id: 1, returnDate: null, rating: null };

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockBookRepository.findOneBy.mockResolvedValue(mockBook);
      mockTransactionRepository.findOne.mockResolvedValue(mockTransaction);
      mockTransactionRepository.save.mockResolvedValue({});
      mockBookRepository.save.mockResolvedValue({});

      await returnBook(1, 1, 5);

      expect(mockTransactionRepository.save).toHaveBeenCalledWith({
        ...mockTransaction,
        returnDate: expect.any(Date),
        rating: 5,
      });
      expect(mockBookRepository.save).toHaveBeenCalledWith({
        ...mockBook,
        totalRatings: 15,
        ratingCount: 3,
        rating: 15 / 3,
        isAvailable: true,
      });
    });
  });
});
