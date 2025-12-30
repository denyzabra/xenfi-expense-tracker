import { prisma } from '@/lib/prisma';
import { AppError } from '@/lib/utils/errors';
import type { CreateExpenseInput, UpdateExpenseInput, FilterExpensesInput } from '@/lib/validators/expense.validator';

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
  try {
    return await prisma.expense.create({
      data: {
        ...data,
        date: data.date ? new Date(data.date) : new Date(),
        userId,
      },
      include: {
        category: true,
      },
    });
  } catch (error: any) {
    // Foreign key constraint will fail if category doesn't exist or doesn't belong to user
    if (error.code === 'P2003') {
      throw new AppError(404, 'Category not found');
    }
    throw error;
  }
};

export const updateExpense = async (id: string, data: UpdateExpenseInput, userId: string) => {
  try {
    // Single query - Prisma will throw if record doesn't exist
    // Foreign key constraint will fail if category doesn't exist
    return await prisma.expense.update({
      where: {
        id,
        userId, // Ensures user can only update their own expenses
      },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
      include: {
        category: true,
      },
    });
  } catch (error: any) {
    // P2025: Record not found (expense doesn't exist or doesn't belong to user)
    if (error.code === 'P2025') {
      throw new AppError(404, 'Expense not found');
    }
    // P2003: Foreign key constraint failed (invalid category)
    if (error.code === 'P2003') {
      throw new AppError(404, 'Category not found');
    }
    throw error;
  }
};

export const deleteExpense = async (id: string, userId: string) => {
  try {
    // Single query - Prisma will throw if record doesn't exist
    await prisma.expense.delete({
      where: {
        id,
        userId, // Ensures user can only delete their own expenses
      },
    });
  } catch (error: any) {
    // P2025: Record not found (expense doesn't exist or doesn't belong to user)
    if (error.code === 'P2025') {
      throw new AppError(404, 'Expense not found');
    }
    throw error;
  }
};
