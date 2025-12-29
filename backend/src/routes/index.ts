import { Router } from 'express';
import authRoutes from './auth.routes';
import categoryRoutes from './category.routes';
import expenseRoutes from './expense.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/expenses', expenseRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
