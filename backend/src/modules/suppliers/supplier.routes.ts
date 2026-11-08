import { Router } from 'express';
import { SupplierController } from './supplier.controller';
import { authenticateToken, requireRoles } from '../../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.use(requireRoles('SUPER_ADMIN', 'ORDER_MANAGER'));

router.get('/', SupplierController.getSuppliers);
router.get('/orders', SupplierController.getSupplierOrders);
router.put('/orders/:id', SupplierController.updateSupplierOrderStatus);
router.get('/:id', SupplierController.getSupplierById);
router.post('/', SupplierController.createSupplier);
router.put('/:id', SupplierController.updateSupplier);
router.delete('/:id', SupplierController.deleteSupplier);

export default router;
