import Joi from "joi";

/* REGISTER */
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),

  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .min(8)
    .pattern(/[A-Z]/)
    .pattern(/[0-9]/)
    .required(),
});


/* LOGIN */
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});


/* FORGOT PASSWORD */
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});


/* RESET PASSWORD */
export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required(),
});
