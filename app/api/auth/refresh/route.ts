import { NextRequest, NextResponse } from 'next/server';
import { refresh } from '@/lib/services/auth.service';
import { handleApiError } from '@/lib/utils/errors';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { status: 'error', message: 'No refresh token provided' },
        { status: 401 }
      );
    }

    const result = await refresh(refreshToken);

    const response = NextResponse.json({
      status: 'success',
      data: {
        accessToken: result.accessToken,
      },
    });

    // Update refresh token cookie
    response.cookies.set('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, {
      status: error.statusCode || 401
    });
  }
}
