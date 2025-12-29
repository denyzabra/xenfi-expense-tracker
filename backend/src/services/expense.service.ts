import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import type { CreateExpenseInput, UpdateExpenseInput, FilterExpensesInput } from '../validators/expense.validator';

export const getAllExpenses = async (userId: string, filters?: FilterExpensesInput) => {
  const where: any = { userId };

  if (filters?.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters?.startDate || filters?.endDate) {
    where.date = {};
    if (filters.startDate) {
      where.date.gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      where.date.lte = new Date(filters.endDate);
    }
  }

  if (filters?.minAmount !== undefined || filters?.maxAmount !== undefined) {
    where.amount = {};
    if (filters.minAmount !== undefined) {
      where.amount.gte = filters.minAmount;
    }
    if (filters.maxAmount !== undefined) {
      where.amount.lte = filters.maxAmount;
    }
  }

  return prisma.expense.findMany({
    where,
    include: {
      category: true,
    },
    orderBy: { date: 'desc' },
  });
};

export const getExpenseById = async (id: string, userId: string) => {
  const expense = await prisma.expense.findFirst({
    where: { id, userId },
    include: {
      category: true,
    },
  });

  if (!expense) {
    throw new AppError(404, 'Expense not found');
  }

  return expense;
};

export const createExpense = async (data: CreateExpenseInput, userId: string) => {
  const category = await prisma.category.findFirst({
    where: { id: data.categoryId, userId },
  });

  if (!category) {
    throw new AppError(404, 'Category not found');
  }

  return prisma.expense.create({
    data: {
      ...data,
      date: data.date ? new Date(data.date) : new Date(),
      userId,
    },
    include: {
      category: true,
    },
  });
};

export const updateExpense = async (id: string, data: UpdateExpenseInput, userId: string) => {
  const expense = await prisma.expense.findFirst({
    where: { id, userId },
  });

  if (!expense) {
    throw new AppError(404, 'Expense not found');
  }

  if (data.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, userId },
    });

    if (!category) {
      throw new AppError(404, 'Category not found');
    }
  }

  return prisma.expense.update({
    where: { id },
    data: {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
    },
    include: {
      category: true,
    },
  });
};

export const deleteExpense = async (id: string, userId: string) => {
  const expense = await prisma.expense.findFirst({
    where: { id, userId },
  });

  if (!expense) {
    throw new AppError(404, 'Expense not found');
  }

  await prisma.expense.delete({
    where: { id },
  });
};
