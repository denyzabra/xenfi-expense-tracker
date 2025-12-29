import { Request, Response } from 'express';
import * as expenseService from '../services/expense.service';
import { createExpenseSchema, updateExpenseSchema, filterExpensesSchema } from '../validators/expense.validator';
import { asyncHandler } from '../utils/asyncHandler';

export const getAllExpenses = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const filters = filterExpensesSchema.partial().parse(req.query);
  const expenses = await expenseService.getAllExpenses(userId, filters);

  res.status(200).json({
    status: 'success',
    data: { expenses },
  });
});

export const getExpenseById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const expense = await expenseService.getExpenseById(req.params.id, userId);

  res.status(200).json({
    status: 'success',
    data: { expense },
  });
});

export const createExpense = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const data = createExpenseSchema.parse(req.body);
  const expense = await expenseService.createExpense(data, userId);

  res.status(201).json({
    status: 'success',
    data: { expense },
  });
});

export const updateExpense = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const data = updateExpenseSchema.parse(req.body);
  const expense = await expenseService.updateExpense(req.params.id, data, userId);

  res.status(200).json({
    status: 'success',
    data: { expense },
  });
});

export const deleteExpense = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  await expenseService.deleteExpense(req.params.id, userId);

  res.status(200).json({
    status: 'success',
    message: 'Expense deleted successfully',
  });
});
