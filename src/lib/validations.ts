import { z } from 'zod';

// Contact Form Schema
export const contactSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters'),
    email: z.string()
        .email('Please enter a valid email address'),
    phone: z.string()
        .regex(/^(\+20|0)?1[0125][0-9]{8}$/, 'Please enter a valid Egyptian phone number')
        .optional()
        .or(z.literal('')),
    subject: z.string()
        .min(3, 'Subject must be at least 3 characters')
        .max(200, 'Subject must be less than 200 characters'),
    message: z.string()
        .min(10, 'Message must be at least 10 characters')
        .max(2000, 'Message must be less than 2000 characters'),
});

// Checkout Form Schema
export const checkoutSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters'),
    email: z.string()
        .email('Please enter a valid email address'),
    phone: z.string()
        .regex(/^(\+20|0)?1[0125][0-9]{8}$/, 'Please enter a valid Egyptian phone number'),
    governorate: z.string()
        .min(2, 'Please select a governorate'),
    city: z.string()
        .min(2, 'Please select a city'),
    address: z.string()
        .min(5, 'Address must be at least 5 characters')
        .max(500, 'Address must be less than 500 characters'),
    paymentMethod: z.enum(['cod', 'instapay'], {
        errorMap: () => ({ message: 'Please select a payment method' })
    }),
});

// Feedback/Testimonial Form Schema
export const feedbackSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters'),
    rating: z.number()
        .min(1, 'Please select a rating')
        .max(5, 'Rating must be between 1 and 5'),
    comment: z.string()
        .min(10, 'Please write at least 10 characters')
        .max(1000, 'Comment must be less than 1000 characters'),
});

// Admin Login Schema
export const loginSchema = z.object({
    email: z.string()
        .email('Please enter a valid email address'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters'),
});

// Type exports for TypeScript
export type ContactFormData = z.infer<typeof contactSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type FeedbackFormData = z.infer<typeof feedbackSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
