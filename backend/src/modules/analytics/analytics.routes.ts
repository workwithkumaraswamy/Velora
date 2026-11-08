import { Router, Request, Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service';
import { sendSuccess } from '../../utils/response';
import { authenticateToken, requireRoles } from '../../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.use(requireRoles('SUPER_ADMIN', 'MENS_MANAGER', 'WOMENS_MANAGER', 'KIDS_MANAGER', 'ORDER_MANAGER'));

router.get('/overview', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AnalyticsService.getDashboardOverview();
    return sendSuccess(res, data, 'Analytics overview retrieved');
  } catch (err: any) {
    next(err);
  }
});

export default router;
