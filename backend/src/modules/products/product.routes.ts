import { Router } from 'express';
import { ProductController } from './product.controller';
import { authenticateToken, requireRoles } from '../../middleware/auth';

const router = Router();

// Public browse routes
router.get('/', ProductController.getProducts);
router.get('/:identifier', ProductController.getProductBySlugOrId);

// Admin & Department Manager management routes
router.post(
  '/',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'MENS_MANAGER', 'WOMENS_MANAGER', 'KIDS_MANAGER'),
  ProductController.createProduct
);

router.put(
  '/:id',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'MENS_MANAGER', 'WOMENS_MANAGER', 'KIDS_MANAGER'),
  ProductController.updateProduct
);

router.delete(
  '/:id',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'MENS_MANAGER', 'WOMENS_MANAGER', 'KIDS_MANAGER'),
  ProductController.deleteProduct
);

export default router;
