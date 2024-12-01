//API DOC: https://documenter.getpostman.com/view/27146547/2sAYBYeq25

import "reflect-metadata";
import dotenv from "dotenv";
import { AppDataSource } from "./config/db";
import app from "./app";
import { seedDatabase } from "./seeder";

dotenv.config();

const PORT = process.env.PORT;

const startServer = async () => {
  try {
 
    await AppDataSource.initialize();
    console.log("Database connected successfully!");
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed");
    process.exit(1); 
  }
};

startServer();
