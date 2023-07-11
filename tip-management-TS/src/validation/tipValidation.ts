import { body } from "express-validator";

export const validatePlace = [
  body("placeName")
    .notEmpty()
    .withMessage("Place name is required")
    .isLength({ min: 3, max: 20 })
    .isString(),
  body("billAmount")
    .notEmpty()
    .isLength({ min: 1, max: 20 })
    .withMessage("Bill amount is required")
    .isNumeric(),
  body("tipAmount")
    .notEmpty()
    .isLength({ min: 1, max: 20 })
    .withMessage("Tip amount is required")
    .isNumeric(),
  body("user_id").notEmpty().withMessage("User ID is required"),
];
