import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/api-middleware';
import { getCategoryById, updateCategory, deleteCategory } from '@/lib/services/category.service';
import { updateCategorySchema } from '@/lib/validators/category.validator';
import { handleApiError } from '@/lib/utils/errors';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(req, async (req, context) => {
    try {
      const { id } = await params;
      const category = await getCategoryById(id, context.userId);

      return NextResponse.json({
        status: 'success',
        data: { category },
      });
    } catch (error: unknown) {
      const errorResponse = handleApiError(error);
      return NextResponse.json(errorResponse, {
        status: (error as { statusCode?: number }).statusCode || 500
      });
    }
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(req, async (req, context) => {
    try {
      const { id } = await params;
      const body = await req.json();
      const data = updateCategorySchema.parse(body);
      const category = await updateCategory(id, data, context.userId);

      return NextResponse.json({
        status: 'success',
        data: { category },
      });
    } catch (error: unknown) {
      const errorResponse = handleApiError(error);
      return NextResponse.json(errorResponse, {
        status: (error as { statusCode?: number }).statusCode || 500
      });
    }
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(req, async (req, context) => {
    try {
      const { id } = await params;
      await deleteCategory(id, context.userId);

      return NextResponse.json({
        status: 'success',
        data: { message: 'Category deleted successfully' },
      });
    } catch (error: unknown) {
      const errorResponse = handleApiError(error);
      return NextResponse.json(errorResponse, {
        status: (error as { statusCode?: number }).statusCode || 500
      });
    }
  });
}
