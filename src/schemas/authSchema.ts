import { z } from "zod";

// Utility schemas
export const emailSchema = z
  .string()
  .email("Invalid email address")
  .transform((email) => email.toLowerCase().trim());

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(50, "Password must be less than 50 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

// Login Schema
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Register Schema
export const registerSchema = loginSchema
  .extend({
    firstname: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name must be less than 50 characters")
      .regex(/^[a-zA-Z]+$/, "First name must contain only letters"),

    lastname: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name must be less than 50 characters")
      .regex(/^[a-zA-Z]+$/, "Last name must contain only letters"),

    confirmPassword: z.string().min(1, "Please confirm your password"),

    role: z.enum(["user", "admin"]).default("user").optional(),

    location: z
      .string()
      .min(1, "Location is required")
      .max(100, "Location must be less than 100 characters"),

    contact: z
      .string()
      .min(1, "Contact information is required")
      .max(20, "Contact must be less than 20 characters")
      .regex(/^[0-9]+$/, "Contact must contain only numbers"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }

    if (data.password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must be at least 6 characters",
        path: ["password"],
      });
    }
  });


