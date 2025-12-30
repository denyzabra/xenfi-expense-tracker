import { NextRequest, NextResponse } from 'next/server';
import { logout } from '@/lib/services/auth.service';
import { withAuth } from '@/lib/auth/api-middleware';
import { handleApiError } from '@/lib/utils/errors';

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, context) => {
    try {
      await logout(context.userId);

      const response = NextResponse.json({
        status: 'success',
        data: { message: 'Logged out successfully' },
      });

      // Clear the refresh token cookie
      response.cookies.set('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/',
      });

      return response;
    } catch (error: any) {
      const errorResponse = handleApiError(error);
      return NextResponse.json(errorResponse, {
        status: error.statusCode || 500
      });
    }
  });
}
