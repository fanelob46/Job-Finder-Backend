import { z } from "zod";

// Define UserRole type for better type safety
export type UserRole = "user" | "admin";

const updateUserSchema = z
  .object({
    firstname: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name must be less than 50 characters")
      .regex(/^[a-zA-Z]+$/, "First name must contain only letters")
      .optional(),

    lastname: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name must be less than 50 characters")
      .regex(/^[a-zA-Z]+$/, "Last name must contain only letters")
      .optional(),

    email: z
      .string()
      .email("Invalid email address")
      .transform((email) => email.toLowerCase().trim())
      .optional(),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password must be less than 50 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .optional(),

    role: z.enum(["user", "admin"]).optional(),
    contact: z
      .string()
      .min(1, "Contact information is required")
      .max(20, "Contact must be less than 20 characters")
      .regex(/^[0-9]+$/, "Contact must contain only numbers"),
  })
  .strict();

// // Infer TypeScript type from the schema
// export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export default updateUserSchema;
