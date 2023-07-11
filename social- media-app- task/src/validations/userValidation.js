import Joi from 'joi';

// Define validation schema
const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  phoneNo: Joi.string().default(''),
  // username: Joi.string().min(3).max(30).optional(), 
  password: Joi.string().pattern(
    new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$')
  ).required().messages({
    'string.pattern.base': 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
  })
});

export default userSchema;
