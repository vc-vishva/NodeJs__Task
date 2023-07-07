import { body } from "express-validator";

export const validateUser = [
  body("f_name").notEmpty().withMessage("First name is required"),
  body("l_name").notEmpty().withMessage("Last name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];
