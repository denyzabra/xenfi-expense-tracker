import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/api-middleware';
import { getAllExpenses, createExpense } from '@/lib/services/expense.service';
import { createExpenseSchema, filterExpensesSchema } from '@/lib/validators/expense.validator';
import { handleApiError } from '@/lib/utils/errors';

export async function GET(req: NextRequest) {
  return withAuth(req, async (req, context) => {
    try {
      const { searchParams } = new URL(req.url);
      const filters = {
        startDate: searchParams.get('startDate') || undefined,
        endDate: searchParams.get('endDate') || undefined,
        categoryId: searchParams.get('categoryId') || undefined,
        minAmount: searchParams.get('minAmount') ? Number(searchParams.get('minAmount')) : undefined,
        maxAmount: searchParams.get('maxAmount') ? Number(searchParams.get('maxAmount')) : undefined,
      };

      const validatedFilters = filterExpensesSchema.partial().parse(filters);
      const expenses = await getAllExpenses(context.userId, validatedFilters);

      return NextResponse.json({
        status: 'success',
        data: { expenses },
      });
    } catch (error: any) {
      const errorResponse = handleApiError(error);
      return NextResponse.json(errorResponse, {
        status: error.statusCode || 500
      });
    }
  });
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, context) => {
    try {
      const body = await req.json();
      const data = createExpenseSchema.parse(body);
      const expense = await createExpense(data, context.userId);

      return NextResponse.json({
        status: 'success',
        data: { expense },
      }, { status: 201 });
    } catch (error: any) {
      const errorResponse = handleApiError(error);
      return NextResponse.json(errorResponse, {
        status: error.statusCode || 500
      });
    }
  });
}
