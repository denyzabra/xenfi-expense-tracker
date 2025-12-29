# Xenfi Expense Tracker - Backend

Backend API for the Xenfi Expense & Accounting Management Platform.

## Tech Stack

- Node.js + Express.js
- TypeScript
- PostgreSQL (Neon.com)
- Prisma ORM
- JWT Authentication
- Zod Validation

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Neon.com account recommended)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Then update the `.env` file with your actual values:
- `DATABASE_URL`: Your Neon.com PostgreSQL connection string
- `JWT_ACCESS_SECRET`: Secret for access tokens (use a strong random string)
- `JWT_REFRESH_SECRET`: Secret for refresh tokens (use a different strong random string)

3. Generate Prisma Client:
```bash
npm run prisma:generate
```

4. Run database migrations:
```bash
npm run prisma:migrate
```

### Development

Run the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma        # Prisma schema
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.ts      # Database connection
│   │   └── env.ts           # Environment validation
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts          # Authentication middleware
│   │   └── errorHandler.ts # Error handling
│   ├── routes/              # API routes
│   │   └── index.ts         # Main router
│   ├── services/            # Business logic
│   ├── types/               # TypeScript types
│   │   └── express.d.ts     # Express type extensions
│   ├── utils/               # Utility functions
│   │   ├── asyncHandler.ts  # Async error wrapper
│   │   └── jwt.ts           # JWT utilities
│   ├── validators/          # Zod schemas
│   └── index.ts             # Entry point
├── .env                     # Environment variables
├── .env.example             # Environment template
├── package.json
└── tsconfig.json
```

## API Documentation

### Health Check

```
GET /api/v1/health
```

Returns server status.

## Environment Variables

See `.env.example` for all required environment variables.

## License

ISC
