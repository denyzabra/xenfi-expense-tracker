import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// @ts-expect-error - Prisma adapter type compatibility issue
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting database seed...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@xenfi.com' },
    update: {},
    create: {
      email: 'demo@xenfi.com',
      password: hashedPassword,
      name: 'Demo User',
    },
  });

  console.log('Created user:', user.email);

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: 'Food & Dining' } },
      update: {},
      create: {
        name: 'Food & Dining',
        description: 'Restaurant meals, groceries, and food delivery',
        color: '#FF6B6B',
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: 'Transportation' } },
      update: {},
      create: {
        name: 'Transportation',
        description: 'Gas, public transit, rideshare, car maintenance',
        color: '#4ECDC4',
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: 'Entertainment' } },
      update: {},
      create: {
        name: 'Entertainment',
        description: 'Movies, concerts, subscriptions, hobbies',
        color: '#95E1D3',
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: 'Shopping' } },
      update: {},
      create: {
        name: 'Shopping',
        description: 'Clothing, electronics, household items',
        color: '#F38181',
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: 'Utilities' } },
      update: {},
      create: {
        name: 'Utilities',
        description: 'Electricity, water, internet, phone bills',
        color: '#AA96DA',
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: 'Healthcare' } },
      update: {},
      create: {
        name: 'Healthcare',
        description: 'Doctor visits, medications, insurance',
        color: '#FCBAD3',
        userId: user.id,
      },
    }),
  ]);

  console.log('Created', categories.length, 'categories');

  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const expenses = await Promise.all([
    prisma.expense.create({
      data: {
        amount: 45.50,
        description: 'Grocery shopping at Whole Foods',
        date: new Date(thisMonth.getTime() + 2 * 24 * 60 * 60 * 1000),
        paymentMethod: 'Credit Card',
        categoryId: categories[0].id,
        userId: user.id,
      },
    }),
    prisma.expense.create({
      data: {
        amount: 12.99,
        description: 'Netflix subscription',
        date: new Date(thisMonth.getTime() + 5 * 24 * 60 * 60 * 1000),
        paymentMethod: 'Credit Card',
        categoryId: categories[2].id,
        userId: user.id,
      },
    }),
    prisma.expense.create({
      data: {
        amount: 60.00,
        description: 'Gas station fill-up',
        date: new Date(thisMonth.getTime() + 7 * 24 * 60 * 60 * 1000),
        paymentMethod: 'Debit Card',
        categoryId: categories[1].id,
        userId: user.id,
      },
    }),
    prisma.expense.create({
      data: {
        amount: 120.00,
        description: 'Electricity bill',
        date: new Date(thisMonth.getTime() + 10 * 24 * 60 * 60 * 1000),
        paymentMethod: 'Bank Transfer',
        categoryId: categories[4].id,
        userId: user.id,
      },
    }),
    prisma.expense.create({
      data: {
        amount: 85.00,
        description: 'Dinner at Italian restaurant',
        date: new Date(thisMonth.getTime() + 12 * 24 * 60 * 60 * 1000),
        paymentMethod: 'Credit Card',
        categoryId: categories[0].id,
        userId: user.id,
      },
    }),
    prisma.expense.create({
      data: {
        amount: 150.00,
        description: 'New running shoes',
        date: new Date(thisMonth.getTime() + 15 * 24 * 60 * 60 * 1000),
        paymentMethod: 'Credit Card',
        categoryId: categories[3].id,
        userId: user.id,
      },
    }),
    prisma.expense.create({
      data: {
        amount: 35.00,
        description: 'Doctor copay',
        date: new Date(thisMonth.getTime() + 18 * 24 * 60 * 60 * 1000),
        paymentMethod: 'Cash',
        categoryId: categories[5].id,
        userId: user.id,
      },
    }),
    prisma.expense.create({
      data: {
        amount: 250.00,
        description: 'Concert tickets',
        date: new Date(thisMonth.getTime() + 20 * 24 * 60 * 60 * 1000),
        paymentMethod: 'Credit Card',
        categoryId: categories[2].id,
        userId: user.id,
      },
    }),
    prisma.expense.create({
      data: {
        amount: 200.00,
        description: 'Monthly groceries',
        date: new Date(lastMonth.getTime() + 15 * 24 * 60 * 60 * 1000),
        paymentMethod: 'Credit Card',
        categoryId: categories[0].id,
        userId: user.id,
      },
    }),
    prisma.expense.create({
      data: {
        amount: 75.00,
        description: 'Uber rides',
        date: new Date(lastMonth.getTime() + 20 * 24 * 60 * 60 * 1000),
        paymentMethod: 'Credit Card',
        categoryId: categories[1].id,
        userId: user.id,
      },
    }),
  ]);

  console.log('Created', expenses.length, 'expenses');
  console.log('\nSeed completed successfully!');
  console.log('\nDemo credentials:');
  console.log('Email: demo@xenfi.com');
  console.log('Password: password123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
