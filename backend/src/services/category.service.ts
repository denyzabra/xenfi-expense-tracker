import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import type { CreateCategoryInput, UpdateCategoryInput } from '../validators/category.validator';

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
  const existingCategory = await prisma.category.findFirst({
    where: {
      userId,
      name: data.name,
    },
  });

  if (existingCategory) {
    throw new AppError(409, 'Category with this name already exists');
  }

  return prisma.category.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const updateCategory = async (id: string, data: UpdateCategoryInput, userId: string) => {
  const category = await prisma.category.findFirst({
    where: { id, userId },
  });

  if (!category) {
    throw new AppError(404, 'Category not found');
  }

  if (data.name && data.name !== category.name) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        userId,
        name: data.name,
        id: { not: id },
      },
    });

    if (existingCategory) {
      throw new AppError(409, 'Category with this name already exists');
    }
  }

  return prisma.category.update({
    where: { id },
    data,
  });
};

export const deleteCategory = async (id: string, userId: string) => {
  const category = await prisma.category.findFirst({
    where: { id, userId },
    include: { _count: { select: { expenses: true } } },
  });

  if (!category) {
    throw new AppError(404, 'Category not found');
  }

  if (category._count.expenses > 0) {
    throw new AppError(400, 'Cannot delete category with associated expenses');
  }

  await prisma.category.delete({
    where: { id },
  });
};
