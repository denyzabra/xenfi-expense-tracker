import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/lib/services/auth.service';
import { loginSchema } from '@/lib/validators/auth.validator';
import { handleApiError } from '@/lib/utils/errors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = loginSchema.parse(body);
    const result = await login(data);

    const response = NextResponse.json({
      status: 'success',
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });

    // Set HTTP-only cookie for refresh token
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
      status: error.statusCode || 500
    });
  }
}
