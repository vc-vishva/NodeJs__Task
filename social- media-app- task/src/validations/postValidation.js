import Joi from 'joi';

const createPostSchema = Joi.object({
  userId: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().valid('private', 'public').default('public'),
  sharedUsers: Joi.array().items(Joi.string()),
  mentions: Joi.array().items(Joi.string()),
  comments: Joi.array().items(
    Joi.object({
      comment: Joi.string().required(),
      userId: Joi.string().required(),
      mentions: Joi.array().items(Joi.string()),
    })
  ),
});

export { createPostSchema };
