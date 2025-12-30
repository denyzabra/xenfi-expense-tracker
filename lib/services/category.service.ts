import { prisma } from '@/lib/prisma';
import { AppError } from '@/lib/utils/errors';
import type { CreateCategoryInput, UpdateCategoryInput } from '@/lib/validators/category.validator';

export const getAllCategories = async (userId: string) => {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const getCategoryById = async (id: string, userId: string) => {
  const category = await prisma.category.findFirst({
    where: { id, userId },
  });

  if (!category) {
    throw new AppError(404, 'Category not found');
  }

  return category;
};

export const createCategory = async (data: CreateCategoryInput, userId: string) => {
  try {
    // Single query - unique constraint will handle duplicate name validation
    return await prisma.category.create({
      data: {
        ...data,
        userId,
      },
    });
  } catch (error: any) {
    // P2002: Unique constraint violation (duplicate name for this user)
    if (error.code === 'P2002') {
      throw new AppError(409, 'Category with this name already exists');
    }
    throw error;
  }
};

export const updateCategory = async (id: string, data: UpdateCategoryInput, userId: string) => {
  try {
    // Single query - unique constraint will handle duplicate name validation
    return await prisma.category.update({
      where: {
        id,
        userId, // Ensures user can only update their own categories
      },
      data,
    });
  } catch (error: any) {
    // P2025: Record not found
    if (error.code === 'P2025') {
      throw new AppError(404, 'Category not found');
    }
    // P2002: Unique constraint violation (duplicate name for this user)
    if (error.code === 'P2002') {
      throw new AppError(409, 'Category with this name already exists');
    }
    throw error;
  }
};

export const deleteCategory = async (id: string, userId: string) => {
  try {
    // Single query - database constraint (onDelete: Restrict) will prevent deletion if expenses exist
    await prisma.category.delete({
      where: {
        id,
        userId, // Ensures user can only delete their own categories
      },
    });
  } catch (error: any) {
    // P2025: Record not found
    if (error.code === 'P2025') {
      throw new AppError(404, 'Category not found');
    }
    // P2003: Foreign key constraint failed (category has associated expenses)
    if (error.code === 'P2003') {
      throw new AppError(400, 'Cannot delete category with associated expenses');
    }
    throw error;
  }
};
