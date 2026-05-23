import { z } from "zod"

export const checkoutSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required.")
    .max(50, "First name is too long.")
    .trim(),
  lastName: z
    .string()
    .min(1, "Last name is required.")
    .max(50, "Last name is too long.")
    .trim(),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address.")
    .trim(),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>
