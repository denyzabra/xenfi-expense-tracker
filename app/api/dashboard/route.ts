import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/api-middleware';
import { getDashboardStats } from '@/lib/services/dashboard.service';
import { handleApiError } from '@/lib/utils/errors';

export async function GET(req: NextRequest) {
  return withAuth(req, async (req, context) => {
    try {
      const { searchParams } = new URL(req.url);
      const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined;
      const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined;

      const stats = await getDashboardStats(context.userId, startDate, endDate);

      return NextResponse.json({
        status: 'success',
        data: stats,
      });
    } catch (error: unknown) {
      const errorResponse = handleApiError(error);
      return NextResponse.json(errorResponse, {
        status: (error as { statusCode?: number }).statusCode || 500
      });
    }
  });
}
