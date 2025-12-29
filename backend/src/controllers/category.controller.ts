import { Request, Response } from 'express';
import * as categoryService from '../services/category.service';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator';
import { asyncHandler } from '../utils/asyncHandler';

export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const categories = await categoryService.getAllCategories(userId);

  res.status(200).json({
    status: 'success',
    data: { categories },
  });
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const category = await categoryService.getCategoryById(req.params.id, userId);

  res.status(200).json({
    status: 'success',
    data: { category },
  });
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const data = createCategorySchema.parse(req.body);
  const category = await categoryService.createCategory(data, userId);

  res.status(201).json({
    status: 'success',
    data: { category },
  });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const data = updateCategorySchema.parse(req.body);
  const category = await categoryService.updateCategory(req.params.id, data, userId);

  res.status(200).json({
    status: 'success',
    data: { category },
  });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  await categoryService.deleteCategory(req.params.id, userId);

  res.status(200).json({
    status: 'success',
    message: 'Category deleted successfully',
  });
});
