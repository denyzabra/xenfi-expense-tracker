import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, JwtPayload } from './jwt';

export async function withAuth(
  req: NextRequest,
  handler: (req: NextRequest, context: JwtPayload) => Promise<NextResponse>
) {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { status: 'error', message: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    return await handler(req, decoded);
  } catch (error: unknown) {
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Invalid token' },
      { status: 401 }
    );
  }
}
