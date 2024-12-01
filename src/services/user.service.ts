import { AppDataSource } from "../config/db";
import { CustomError} from "../middlewares/errorHandler";
import { Transaction } from "../models/transaction.model";
import { User } from "../models/user.model";

const userRepository = AppDataSource.getRepository(User);
const transactionRepository = AppDataSource.getRepository(Transaction);

export const listUsers = async () => {
  const users = await userRepository.find();
  return users;
};

export const getUserDetails = async (userId: number) => {
  const user = await userRepository.findOneBy({ id: userId });
  if (!user) {
    throw new CustomError("User not found", 404);
  }
  const transactions = await transactionRepository.find({
    where: { user: { id: user.id } },
    relations: ["book"],
  });

  const pastBooks = transactions
    .filter((transaction) => transaction.returnDate !== null)
    .map((transaction) => ({
      title: transaction.book.title,
      rating: transaction.book.rating,
    }));

  const presentBooks = transactions
    .filter((transaction) => transaction.returnDate === null)
    .map((transaction) => ({
      title: transaction.book.title,
      rating: transaction.book.rating,
    }));

  return {
    id: user.id,
    name: user.name,
    books: {
      past: pastBooks,
      present: presentBooks,
    },
  };
};

export const createUser = async (name: string, email: string) => {
  const existingUser = await userRepository.findOneBy({ email });
  if (existingUser) {
    throw new CustomError("User already exists.", 409);
  }
  const user = userRepository.create({ name, email });
  return await userRepository.save(user);
};
