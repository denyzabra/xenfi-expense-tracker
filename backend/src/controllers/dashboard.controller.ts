import { Request, Response } from 'express';
import * as dashboardService from '../services/dashboard.service';
import { asyncHandler } from '../utils/asyncHandler';
import { z } from 'zod';

const dashboardQuerySchema = z.object({
  startDate: z.string().datetime().or(z.date()).optional(),
  endDate: z.string().datetime().or(z.date()).optional(),
});

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const query = dashboardQuerySchema.parse(req.query);

  const stats = await dashboardService.getDashboardStats(
    userId,
    query.startDate ? new Date(query.startDate) : undefined,
    query.endDate ? new Date(query.endDate) : undefined
  );

  res.status(200).json({
    status: 'success',
    data: stats,
  });
});
