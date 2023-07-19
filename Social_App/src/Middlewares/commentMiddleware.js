import createCommentValidation from "../validations/commentValidation.js";


const validateCreateComment = (req, res, next) => {
  const { error } = createCommentValidation.validate(req.body);

  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  next();
};

export { validateCreateComment };
