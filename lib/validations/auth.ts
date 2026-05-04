import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().optional(),
});

export const signinSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(1, "Password is required"),
});

export const resetPasswordSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
});

export const confirmResetSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ConfirmResetInput = z.infer<typeof confirmResetSchema>;
