import { body } from "express-validator";

export const validateUser = [
  body("f_name")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 20 })
    .isString(),
  body("l_name")
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 20 })
    .isString(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .isLength({ min: 5, max: 20 })
    .isString(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 4, max: 20 })
    .isString(),
];
