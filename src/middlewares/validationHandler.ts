import { check, validationResult, ValidationChain } from "express-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";

export const validationMiddleware = (
  validations: ValidationChain[]
): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
      return; 
    }
    next();
  };
};


export const validateUser = validationMiddleware([
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
]);


export const validateBook = validationMiddleware([
  check("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),
  check("author")
    .notEmpty()
    .withMessage("Author is required")
    .isString()
    .withMessage("Author must be a string"),
]);


export const validateTransaction = validationMiddleware([
  check("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isInt()
    .withMessage("User ID must be an integer"),
  check("bookId")
    .notEmpty()
    .withMessage("Book ID is required")
    .isInt()
    .withMessage("Book ID must be an integer"),
]);
