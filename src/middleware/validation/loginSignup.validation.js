import Joi from "joi";



export const registerSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(3).required(),
  // confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
//   role: Joi.string().valid("USER", "ADMIN"),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});