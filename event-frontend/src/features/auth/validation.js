import { z } from "zod";

/* LOGIN */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(8, { message: "Password required minimum 8" }),
});


/* REGISTER */
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name required" }),

  email: z
    .string()
    .trim()
    .email({ message: "Invalid email address" }),

password: z
  .string()
  .min(8, { message: "Minimum 8 characters" })
  .regex(/[A-Z]/, { message: "Add one capital letter" })
  .regex(/[0-9]/, { message: "Add one number" })
});
