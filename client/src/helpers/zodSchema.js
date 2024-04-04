import { z } from 'zod';

export const registerFormSchema = z.object({
  fullname: z.string({
    required_error: "Fullname is required.",
    invalid_type_error: "Fullname must be a string."
  }).min(2, { message: "Fullname must be at least 2 or more characters long. "}).max(30, { message: "Fullname must be 30 or fewer characters long." }),
  email: z.string().email({ message: "Email is required and must be in a correct format." }),
  password: z.string({
    required_error: "Password is required"
  }).min(6, { message: "Password at least 6 or more characters long." }).max(20, { message: "Password at least 20 or fewer characters long." }),
  confirmPassword: z.string().min(6, {message: "Confirm password at least 6 or more characters long."}).max(20, {message: "Confirm password at least 20 or fewer characters long."}),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password do not match",
  path: ["confirmPassword"]
});

export const loginFormSchema = z.object({
  email: z.string().email({ message: "Email is required and must be in a correct format." }),
  password: z.string({
    required_error: "Password is required"
  }).min(6, { message: "Password at least 6 or more characters long." }).max(20, { message: "Password at least 20 or fewer characters long." }),
});

export const addNewProductFormSchema = z.object({
  name: z.string({
    required_error: "Product name is required.",
    invalid_type_error: "Product name must be a string."
  }).min(2, { message: "Product name must be at least 2 or more characters long. "}).max(30, { message: "Product name must be 30 or fewer characters long." }),
  description: z.string({
    required_error: "Product description is required.",
    invalid_type_error: "Product description must be a string."
  }).min(2, { message: "Product description must be at least 2 or more characters long. "}).max(150, { message: "Product description must be 30 or fewer characters long." }),
  price: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, {
    message: "Product price must be a valid number greater than 0."
  })
});