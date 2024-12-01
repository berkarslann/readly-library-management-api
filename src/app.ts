import express, { Application } from "express";
import userRoutes from "./routes/user.routes";
import bookRoutes from "./routes/book.routes";
import errorHandler from "./middlewares/errorHandler";

const app: Application = express();


app.use(express.json()); 


app.use("/users", userRoutes); 
app.use("/books", bookRoutes); 

app.get("/", (req, res) => {
  res.send("Library Management System is running...");
});

app.use(errorHandler);
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack); 
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

export default app;
