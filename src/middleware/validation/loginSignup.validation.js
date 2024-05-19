import Joi from "joi";

export const registerSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .messages({
      "string.pattern.base":
        'Password must contain only letters, numbers, or "@" and be between 3 and 30 characters long.',
    }),
  // confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  //   role: Joi.string().valid("USER", "ADMIN"),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
