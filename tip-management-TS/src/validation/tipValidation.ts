import { body } from "express-validator";

export const validatePlace = [
  body("placeName").notEmpty().withMessage("Place name is required"),
  body("billAmount")
    .notEmpty()
    .withMessage("Bill amount is required")
    .isNumeric()
    .withMessage("Bill amount must be a number"),
  body("tipAmount")
    .notEmpty()
    .withMessage("Tip amount is required")
    .isNumeric()
    .withMessage("Tip amount must be a number"),
  body("user_id").notEmpty().withMessage("User ID is required"),
];
