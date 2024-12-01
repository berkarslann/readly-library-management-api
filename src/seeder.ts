import { AppDataSource } from "./config/db";
import { User } from "./models/user.model";
import { Book } from "./models/book.model";

export const seedDatabase = async () => {
  const userRepository = AppDataSource.getRepository(User);
  const bookRepository = AppDataSource.getRepository(Book);

  const users = [
    { name: "Gürhan", email: "gürhan@gmail.com" },
    { name: "Büşra", email: "büşra@gmail.com" },
    { name: "Eren", email: "eren@gmail.com" },
    { name: "Fırat", email: "fırat@gmail.com" },
    { name: "Ahmet", email: "ahmet@gmail.com" },
    { name: "Ekinsu", email: "ekinsu@gmail.com" },
    { name: "Zeynel", email: "zeynel@gmail.com" },
    { name: "Melih", email: "melih@gmail.com" },
    { name: "Furkan", email: "furkan@gmail.com" },
    { name: "Deniz", email: "deniz@gmail.com" },
  ];

  const books = [
    { title: "Invisible Monsters", author: "Chuck Palahniuk" },
    { title: "Fight Club", author: "Chuck Palahniuk" },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
    { title: "The Catcher in the Rye", author: "J.D. Salinger" },
    { title: "Pride and Prejudice", author: "Jane Austen" },
    { title: "Moby Dick", author: "Herman Melville" },
    { title: "Brave New World", author: "Aldous Huxley" },
    { title: "The Lord of the Rings", author: "J.R.R. Tolkien" },
    { title: "Animal Farm", author: "George Orwell" },
    { title: "The Hobbit", author: "J.R.R. Tolkien" },
  ];

  try {
    console.log("Seeding database...");

    for (const userData of users) {
      const existingUser = await userRepository.findOneBy({
        email: userData.email,
      });
      if (!existingUser) {
        const user = userRepository.create(userData);
        await userRepository.save(user);
      }
    }

    for (const bookData of books) {
      const existingBook = await bookRepository.findOneBy({
        title: bookData.title,
      });
      if (!existingBook) {
        const book = bookRepository.create(bookData);
        await bookRepository.save(book);
      }
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error during database seeding:", error);
  }
};
