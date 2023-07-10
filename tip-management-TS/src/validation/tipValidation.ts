import { body } from "express-validator";

export const validatePlace = [
  body("placeName")
    .notEmpty()
    .withMessage("Place name is required")
    .isLength({ min: 25 })
    .isString(),
  body("billAmount")
    .notEmpty()
    .isLength({ min: 25 })
    .withMessage("Bill amount is required")
    .isNumeric()
    .isLength({ min: 25 })
    .withMessage("Bill amount must be a number"),
  body("tipAmount")
    .notEmpty()
    .isLength({ min: 25 })
    .withMessage("Tip amount is required")
    .isNumeric()
    .withMessage("Tip amount must be a number"),
  body("user_id").notEmpty().withMessage("User ID is required"),
];
