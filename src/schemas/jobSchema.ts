import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  type: z.string().min(3, "Type must be at least 3 characters").optional(),
  location: z
    .string()
    .min(3, "Location must be at least 3 characters")
    .optional(),
  category: z
    .string()
    .min(3, "Category must be at least 3 characters")
    .optional(),
  salary: z.coerce
    .number({ invalid_type_error: "Salary must be a number" })
    .positive("Salary must be positive")
    .transform((val) => val.toString()),
  desc: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .optional(),
  requirements: z
    .string()
    .min(3, "Requirements must be at least 3 characters")
    .optional(),
});


