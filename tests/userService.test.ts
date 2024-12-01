import { AppDataSource } from "../src/config/db";
import { User } from "../src/models/user.model";
import { Transaction } from "../src/models/transaction.model";
import { listUsers, getUserDetails, createUser } from "../src/services/user.service";
import { CustomError } from "../src/middlewares/errorHandler";
jest.mock("../src/config/db");

const createMockRepository = () => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const mockUserRepository = createMockRepository();
const mockTransactionRepository = createMockRepository();

(AppDataSource.getRepository as jest.Mock).mockImplementation((model) => {
  if (model === User) return mockUserRepository;
  if (model === Transaction) return mockTransactionRepository;
  throw new Error("Unexpected model");
});


describe("User Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("listUsers", () => {
    it("should return a list of users", async () => {
      const mockUsers = [{ id: 1, name: "Berk" }, { id: 2, name: "Ali" }];
      mockUserRepository.find.mockResolvedValue(mockUsers);

      const users = await listUsers();

      expect(mockUserRepository.find).toHaveBeenCalled();
      expect(users).toEqual(mockUsers);
    });
  });

  describe("getUserDetails", () => {
    it("should throw an error if the user does not exist", async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(getUserDetails(1)).rejects.toThrow(CustomError);
      await expect(getUserDetails(1)).rejects.toThrow("User not found");
    });

    it("should return user details with past and present books", async () => {
      const mockUser = { id: 1, name: "Berk" };
      const mockTransactions = [
        {
          returnDate: null,
          book: { title: "Görünmez Canavalar", rating: 5 },
        },
        {
          returnDate: new Date(),
          book: { title: "Sabahtan Akşama", rating: 4 },
        },
      ];

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockTransactionRepository.find.mockResolvedValue(mockTransactions);

      const userDetails = await getUserDetails(1);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockTransactionRepository.find).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id } },
        relations: ["book"],
      });
      expect(userDetails).toEqual({
        id: 1,
        name: "Berk",
        books: {
          past: [{ title: "Sabahtan Akşama", rating: 4 }],
          present: [{ title: "Görünmez Canavarlar", rating: 5 }],
        },
      });
    });
  });

  describe("createUser", () => {
    it("should throw an error if the user already exists", async () => {
      mockUserRepository.findOneBy.mockResolvedValue({ id: 1, email: "berk@gmail.com" });

      await expect(createUser("Berk", "berk@gmail.com")).rejects.toThrow(CustomError);
      await expect(createUser("Berk", "berk@gmail.com")).rejects.toThrow(
        "User already exists."
      );
    });

    it("should create and return a new user if the user does not exist", async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);
      const mockUser = { id: 1, name: "Berk", email: "berk@gmail.com" };
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const newUser = await createUser("Berk", "berk@gmail.com");

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email: "berk@example.com" });
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        name: "Berk",
        email: "berk@gmail.com",
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(newUser).toEqual(mockUser);
    });
  });
});
