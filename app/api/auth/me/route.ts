import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/services/auth.service';
import { withAuth } from '@/lib/auth/api-middleware';
import { handleApiError } from '@/lib/utils/errors';

export async function GET(req: NextRequest) {
  return withAuth(req, async (req, context) => {
    try {
      const user = await getCurrentUser(context.userId);

      return NextResponse.json({
        status: 'success',
        data: { user },
      });
    } catch (error: any) {
      const errorResponse = handleApiError(error);
      return NextResponse.json(errorResponse, {
        status: error.statusCode || 500
      });
    }
  });
}
