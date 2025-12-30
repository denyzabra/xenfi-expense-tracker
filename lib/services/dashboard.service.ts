import { prisma } from '@/lib/prisma';
import { startOfMonth, endOfMonth } from 'date-fns';

export const getDashboardStats = async (userId: string, startDate?: Date, endDate?: Date) => {
  const start = startDate || startOfMonth(new Date());
  const end = endDate || endOfMonth(new Date());

  const [totalExpenses, categoryBreakdown, recentExpenses, totalCount] = await Promise.all([
    prisma.expense.aggregate({
      where: {
        userId,
        date: {
          gte: start,
          lte: end,
        },
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.expense.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        date: {
          gte: start,
          lte: end,
        },
      },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    }),

    prisma.expense.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
      },
      orderBy: {
        date: 'desc',
      },
      take: 10,
    }),

    prisma.expense.count({
      where: {
        userId,
        date: {
          gte: start,
          lte: end,
        },
      },
    }),
  ]);

  const categoriesMap = new Map();
  const categories = await prisma.category.findMany({
    where: {
      userId,
    },
  });

  categories.forEach((cat) => {
    categoriesMap.set(cat.id, cat);
  });

  const categoryBreakdownWithDetails = categoryBreakdown.map((item) => ({
    category: categoriesMap.get(item.categoryId),
    totalAmount: item._sum.amount || 0,
    count: item._count.id,
  }));

  return {
    summary: {
      totalAmount: totalExpenses._sum.amount || 0,
      totalCount,
      period: {
        start,
        end,
      },
    },
    categoryBreakdown: categoryBreakdownWithDetails,
    recentExpenses,
  };
};
