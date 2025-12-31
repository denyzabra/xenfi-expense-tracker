import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/api-middleware';
import { getAllCategories, createCategory } from '@/lib/services/category.service';
import { createCategorySchema } from '@/lib/validators/category.validator';
import { handleApiError } from '@/lib/utils/errors';

export async function GET(req: NextRequest) {
  return withAuth(req, async (req, context) => {
    try {
      const categories = await getAllCategories(context.userId);

      return NextResponse.json({
        status: 'success',
        data: { categories },
      });
    } catch (error: unknown) {
      const errorResponse = handleApiError(error);
      return NextResponse.json(errorResponse, {
        status: (error as { statusCode?: number }).statusCode || 500
      });
    }
  });
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, context) => {
    try {
      const body = await req.json();
      const data = createCategorySchema.parse(body);
      const category = await createCategory(data, context.userId);

      return NextResponse.json({
        status: 'success',
        data: { category },
      }, { status: 201 });
    } catch (error: unknown) {
      const errorResponse = handleApiError(error);
      return NextResponse.json(errorResponse, {
        status: (error as { statusCode?: number }).statusCode || 500
      });
    }
  });
}
