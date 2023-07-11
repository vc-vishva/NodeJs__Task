import Joi from 'joi';

// Define validation schema
const createCommentValidation = Joi.object({
  comment: Joi.string().required(),
  userId: Joi.string().required(),
  mentions: Joi.array().items(Joi.string()),
});

export default createCommentValidation;
