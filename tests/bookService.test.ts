import {
  listBooks,
  getBookDetails,
  createBook,
} from "../src/services/book.service";
import { AppDataSource } from "../src/config/db";
import { Book } from "../src/models/book.model";
import { CustomError } from "../src/middlewares/errorHandler";

jest.mock("../../src/config/db");

const mockBookRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

(AppDataSource.getRepository as jest.Mock).mockImplementation((model) => {
  if (model === Book) return mockBookRepository;
  throw new Error("Unexpected model");
});

describe("Book Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("listBooks", () => {
    it("should return a list of books", async () => {
      const mockBooks = [
        { id: 1, title: "Book 1", author: "Author 1" },
        { id: 2, title: "Book 2", author: "Author 2" },
      ];
      mockBookRepository.find.mockResolvedValue(mockBooks);

      const books = await listBooks();

      expect(mockBookRepository.find).toHaveBeenCalled();
      expect(books).toEqual(mockBooks);
    });
  });

  describe("getBookDetails", () => {
    it("should throw an error if the book does not exist", async () => {
      mockBookRepository.findOne.mockResolvedValue(null);

      await expect(getBookDetails(1)).rejects.toThrow(CustomError);
      await expect(getBookDetails(1)).rejects.toThrow("Book not found");
    });

    it("should return the book details if the book exists", async () => {
      const mockBook = { id: 1, title: "Book 1", author: "Author 1" };
      mockBookRepository.findOne.mockResolvedValue(mockBook);

      const book = await getBookDetails(1);

      expect(mockBookRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(book).toEqual(mockBook);
    });
  });

  describe("createBook", () => {
    it("should throw an error if the book already exists", async () => {
      mockBookRepository.findOneBy.mockResolvedValue({
        id: 1,
        title: "Book 1",
      });

      await expect(createBook("Book 1", "Author 1")).rejects.toThrow(
        CustomError
      );
      await expect(createBook("Book 1", "Author 1")).rejects.toThrow(
        "Book already exists."
      );
    });

    it("should create and return a new book if it does not exist", async () => {
      mockBookRepository.findOneBy.mockResolvedValue(null);
      const mockBook = { id: 1, title: "Book 1", author: "Author 1" };
      mockBookRepository.create.mockReturnValue(mockBook);
      mockBookRepository.save.mockResolvedValue(mockBook);

      const newBook = await createBook("Book 1", "Author 1");

      expect(mockBookRepository.findOneBy).toHaveBeenCalledWith({
        title: "Book 1",
      });
      expect(mockBookRepository.create).toHaveBeenCalledWith({
        title: "Book 1",
        author: "Author 1",
      });
      expect(mockBookRepository.save).toHaveBeenCalledWith(mockBook);
      expect(newBook).toEqual(mockBook);
    });
  });
});
