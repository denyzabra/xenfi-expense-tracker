import { z } from 'zod';

export const createExpenseSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().datetime().or(z.date()).optional(),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  attachmentUrl: z.string().url().optional(),
  categoryId: z.string().min(1, 'Category is required'),
});

export const updateExpenseSchema = z.object({
  amount: z.number().positive('Amount must be positive').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  date: z.string().datetime().or(z.date()).optional(),
  paymentMethod: z.string().min(1, 'Payment method is required').optional(),
  attachmentUrl: z.string().url().optional(),
  categoryId: z.string().min(1, 'Category is required').optional(),
});

export const filterExpensesSchema = z.object({
  startDate: z.string().datetime().or(z.date()).optional(),
  endDate: z.string().datetime().or(z.date()).optional(),
  categoryId: z.string().optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type FilterExpensesInput = z.infer<typeof filterExpensesSchema>;
