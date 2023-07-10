import { body } from "express-validator";

export const validateUser = [
  body("f_name")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ max: 25 })
    .isString(),
  body("l_name")
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ max: 25 })
    .isString(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .isLength({ max: 25 })
    .isString(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ max: 25 })
    .isString(),
];
