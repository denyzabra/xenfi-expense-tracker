import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/api-middleware';
import { getExpenseById, updateExpense, deleteExpense } from '@/lib/services/expense.service';
import { updateExpenseSchema } from '@/lib/validators/expense.validator';
import { handleApiError } from '@/lib/utils/errors';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(req, async (req, context) => {
    try {
      const { id } = await params;
      const expense = await getExpenseById(id, context.userId);

      return NextResponse.json({
        status: 'success',
        data: { expense },
      });
    } catch (error: any) {
      const errorResponse = handleApiError(error);
      return NextResponse.json(errorResponse, {
        status: error.statusCode || 500
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
      const data = updateExpenseSchema.parse(body);
      const expense = await updateExpense(id, data, context.userId);

      return NextResponse.json({
        status: 'success',
        data: { expense },
      });
    } catch (error: any) {
      const errorResponse = handleApiError(error);
      return NextResponse.json(errorResponse, {
        status: error.statusCode || 500
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
      await deleteExpense(id, context.userId);

      return NextResponse.json({
        status: 'success',
        data: { message: 'Expense deleted successfully' },
      });
    } catch (error: any) {
      const errorResponse = handleApiError(error);
      return NextResponse.json(errorResponse, {
        status: error.statusCode || 500
      });
    }
  });
}
