import Joi from 'joi';
import { createPostSchema } from '../validations/postValidation.js';

const validatePost = (req, res, next) => {
  const { error } = createPostSchema.validate(req.body);
  if (error) {
    // If validation fails, return the error message
    return res.status(400).json({ error: error.details[0].message });
  }
  // If validation passes, proceed to the next middleware or route handler
  next();
};

export { validatePost };
