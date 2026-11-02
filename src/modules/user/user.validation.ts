import z from "zod";

const schema = z
  .object({
    name: z
      .string({ error: "Name is required" })
      .trim()
      .min(1, "Name is required"),
    email: z.email({ error: "A valid email is required" }),
    password: z
      .string({ error: "Password is required" })
      .min(1, "Password is required"),
    confirmPassword: z
      .string({ error: "Confirm password is required" })
      .min(1, "Confirm password is required"),
    phone: z.string().trim().optional(),
    address: z
      .object({
        street: z.string().trim().optional(),
        city: z.string().trim().min(1, "City is required"),
        country: z.string().trim().optional(),
        postalCode: z.string().trim().optional(),
      })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });


const create = z.object({
  body:schema
})


const userValidationSchema = {
  create,
};

export default userValidationSchema