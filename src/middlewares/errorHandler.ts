import { Request, Response, NextFunction } from "express";

export class CustomError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
  }
}


const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.message);

  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default errorHandler;

