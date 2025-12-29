# Xenfi Expense & Accounting Management Platform

A full-stack expense and accounting management platform with complete CRUD operations, authentication, and dashboard analytics.

## Project Structure

```
xenfi-expense-tracker/
├── backend/                 # Node.js + Express.js + TypeScript API
├── frontend/                # React + TypeScript + Vite
└── README.md               # This file
```

## Tech Stack

### Backend
- Node.js + Express.js
- TypeScript (strict mode)
- PostgreSQL (Neon.com)
- Prisma ORM
- JWT Authentication (access + refresh tokens)
- Zod Validation
- Bcrypt for password hashing

### Frontend
- React 19
- TypeScript
- Vite
- Recharts for data visualization
- Lucide React icons

## Features

### Authentication
- ✅ User signup and login
- ✅ JWT-based authentication
- ✅ Access tokens (15min) + Refresh tokens (7 days)
- ✅ Protected routes
- ✅ Session management

### Expense Management
- ✅ Create, Read, Update, Delete expenses
- ✅ Filter by date range, category, amount
- ✅ Categorization with custom colors
- ✅ Payment method tracking
- ✅ Optional attachment URLs

### Dashboard
- ✅ Total expenses for current month
- ✅ Expense count and breakdown by category
- ✅ Recent expenses list
- ✅ Visual charts (Bar & Pie charts)
- ✅ Date range filtering

### Database
- ✅ PostgreSQL with Prisma migrations
- ✅ Data validations (required fields, numeric checks)
- ✅ Seed script with sample data
- ✅ Proper indexing for performance

## Quick Start

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
# Update .env with your Neon.com DATABASE_URL
# JWT secrets are already generated

# Run migrations
npm run prisma:migrate

# Seed database with demo data
npm run prisma:seed

# Start development server
npm run dev
```

Backend runs on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173` (or the port Vite assigns)

## Demo Account

Email: `demo@xenfi.com`
Password: `password123`

## API Endpoints

Base URL: `http://localhost:5000/api/v1`

### Authentication
- `POST /auth/signup` - Create account
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout (requires auth)
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user (requires auth)

### Categories
- `GET /categories` - Get all categories (requires auth)
- `POST /categories` - Create category (requires auth)
- `PUT /categories/:id` - Update category (requires auth)
- `DELETE /categories/:id` - Delete category (requires auth)

### Expenses
- `GET /expenses` - Get all expenses with filters (requires auth)
- `POST /expenses` - Create expense (requires auth)
- `PUT /expenses/:id` - Update expense (requires auth)
- `DELETE /expenses/:id` - Delete expense (requires auth)

### Dashboard
- `GET /dashboard` - Get dashboard statistics (requires auth)
  - Query params: `startDate`, `endDate`

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=<your-neon-postgresql-url>
PORT=5000
NODE_ENV=development
JWT_ACCESS_SECRET=<generated>
JWT_REFRESH_SECRET=<generated>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api/v1
```

## Database Schema

### User
- id, email (unique), password (hashed), name, refreshToken

### Category
- id, name, description, color, userId
- Unique constraint: (userId, name)

### Expense
- id, amount, description, date, paymentMethod, attachmentUrl, categoryId, userId
- Indexes on: userId, categoryId, date

## Development Scripts

### Backend
- `npm run dev` - Start with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run migrations
- `npm run prisma:seed` - Seed database
- `npm run prisma:studio` - Open Prisma Studio

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Highlights

- ✅ Clean separation between frontend and backend
- ✅ Type-safe with TypeScript throughout
- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation with Zod
- ✅ Secure password storage (bcrypt)
- ✅ JWT authentication with refresh tokens
- ✅ Database migrations and seeding
- ✅ Responsive UI components
- ✅ Real-time data synchronization

## License

ISC
