import { Router } from 'express';
import { AIController } from './ai.controller';
import { authenticateToken, requireRoles } from '../../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.use(requireRoles('SUPER_ADMIN', 'MENS_MANAGER', 'WOMENS_MANAGER', 'KIDS_MANAGER'));

router.post('/description', AIController.generateDescription);
router.post('/image', AIController.generateImage);
router.post('/import-supplier', AIController.importSupplierProduct);

export default router;
