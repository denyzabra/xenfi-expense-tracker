# XenFi - Expense Tracker

A modern, full-stack expense tracking application built with Next.js 15 App Router, featuring a beautiful dark theme UI and comprehensive financial management tools.

## Features

### Core Functionality
- **Complete CRUD Operations** - Full create, read, update, delete for expenses and categories
- **Smart Financial Management** - Track expenses, analyze spending patterns, and gain insights into your financial health
- **Real-time Analytics** - Interactive charts and visualizations powered by Recharts
- **Category Management** - Organize expenses across multiple customizable categories with color coding
- **Advanced Data Table** - Powerful filtering, sorting, and pagination with TanStack React Table

### User Experience
- **Toast Notifications** - Professional centered feedback for all operations (create, update, delete)
- **Confirmation Modals** - Industry-standard centered modals for destructive actions
- **Secure Authentication** - Custom JWT-based authentication with access and refresh tokens
- **Beautiful Dark Theme** - Carefully crafted UI with Tailwind CSS
- **Responsive Design** - Fully responsive across all device sizes

### Technical Features
- **Type-Safe** - Full TypeScript support across frontend and backend
- **Optimized Performance** - Single-query CRUD operations for 50-66% faster response times
- **Database Constraints** - Leverages PostgreSQL constraints for data integrity

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS v3** - Utility-first CSS framework
- **Recharts** - Composable charting library
- **TanStack React Table** - Headless UI for building powerful tables
- **Lucide React** - Beautiful icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM v5** - Type-safe database access
- **PostgreSQL (Neon)** - Serverless Postgres database with driver adapters
- **JWT** - JSON Web Token authentication
- **Zod** - TypeScript-first schema validation
- **bcryptjs** - Password hashing

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon recommended for serverless deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd xenfi-expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory with the following:
   ```env
   # Database
   DATABASE_URL="your-neon-database-url"

   # JWT Secrets (generate strong random strings)
   JWT_ACCESS_SECRET="your-access-secret-here"
   JWT_REFRESH_SECRET="your-refresh-secret-here"
   JWT_ACCESS_EXPIRES_IN="15m"
   JWT_REFRESH_EXPIRES_IN="7d"

   # Environment
   NODE_ENV="development"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed the database (optional)**
   ```bash
   npm run prisma:seed
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed the database

## Project Structure

```
xenfi-expense-tracker/
├── app/
│   ├── (auth)/              # Authentication routes
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/         # Dashboard routes
│   │   ├── categories/      # Category management page
│   │   ├── expenses/        # Expense management page
│   │   ├── layout.tsx       # Dashboard layout with modal
│   │   └── page.tsx         # Dashboard home
│   ├── api/                 # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── categories/      # Category CRUD endpoints
│   │   ├── dashboard/       # Dashboard statistics
│   │   └── expenses/        # Expense CRUD endpoints
│   ├── globals.css
│   └── layout.tsx           # Root layout with providers
├── components/              # React components
│   ├── providers/           # Context providers
│   │   ├── AuthProvider.tsx
│   │   ├── ToastProvider.tsx
│   │   └── TransactionModalProvider.tsx
│   ├── ConfirmModal.tsx     # Confirmation dialog
│   ├── Dashboard.tsx        # Dashboard component
│   ├── ExpensesView.tsx     # Expenses table view
│   ├── Layout.tsx           # Main layout
│   ├── Toast.tsx            # Toast notification
│   └── TransactionModal.tsx # Transaction form modal
├── lib/
│   ├── auth/               # Authentication utilities
│   │   ├── api-middleware.ts
│   │   └── jwt.ts
│   ├── services/           # Business logic
│   │   ├── category.service.ts
│   │   ├── expense.service.ts
│   │   └── auth.service.ts
│   ├── utils/              # Utility functions
│   │   ├── api-client.ts
│   │   └── errors.ts
│   ├── validators/         # Zod schemas
│   │   ├── auth.validator.ts
│   │   ├── category.validator.ts
│   │   └── expense.validator.ts
│   ├── constants.tsx       # Navigation and constants
│   └── prisma.ts           # Prisma client
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Database migrations
│   └── seed.ts            # Database seeding
├── types/
│   └── index.ts           # TypeScript type definitions
└── public/                # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/logout` - Logout and invalidate tokens
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user profile

### Expenses
- `GET /api/expenses` - Get all expenses with optional filters
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/[id]` - Get expense by ID
- `PUT /api/expenses/[id]` - Update expense
- `DELETE /api/expenses/[id]` - Delete expense

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `GET /api/categories/[id]` - Get category by ID
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category (only if no expenses exist)

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics and analytics

## Database Schema

The application uses three main models:

### User
- Authentication and user profile information
- One-to-many relationships with Expenses and Categories

### Category
- Name, description, and color for expense categorization
- Unique constraint on (userId, name)
- Cascade delete when user is deleted
- Restrict delete when expenses exist

### Expense
- Amount, description, date, payment method, and optional attachment
- Foreign keys to User and Category
- Indexed on userId, categoryId, and date for optimal query performance

See `prisma/schema.prisma` for the complete schema definition.

## Performance Optimizations

The application implements several performance optimizations:

1. **Single-Query CRUD Operations** - Reduced from 2-3 database queries to 1 per operation
2. **Database Constraints** - Leverages PostgreSQL foreign keys and unique constraints
3. **Indexed Queries** - Strategic indexes on userId, categoryId, and date fields
4. **Error Code Handling** - Validates through Prisma error codes instead of separate queries

These optimizations result in 50-66% faster CRUD operations.


### Environment Variables for Production

Set these in your Vercel dashboard or hosting platform:
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_ACCESS_SECRET` - Secret for access tokens (use strong random string)
- `JWT_REFRESH_SECRET` - Secret for refresh tokens (use strong random string)
- `JWT_ACCESS_EXPIRES_IN` - Access token expiration (e.g., "15m")
- `JWT_REFRESH_EXPIRES_IN` - Refresh token expiration (e.g., "7d")
- `NODE_ENV` - Set to "production"

## Security Considerations

- Passwords are hashed using bcryptjs before storage
- JWT tokens use separate secrets for access and refresh tokens
- All API routes are protected with authentication middleware
- Database queries use parameterized statements (via Prisma)
- User data is isolated using userId constraints

## License

MIT

## Author

Abraham Denis Omongole
