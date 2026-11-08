import { Router, Request, Response } from 'express';
import { store } from '../../utils/store';
import { sendSuccess, sendError } from '../../utils/response';
import { authenticateToken, requireRoles } from '../../middleware/auth';

const router = Router();

// Validate a coupon code for customer
router.post('/validate', (req: Request, res: Response) => {
  const { code, subtotal, departmentId } = req.body;
  if (!code) return sendError(res, 'Coupon code is required', 400);

  const coupon = store.coupons.find(
    c => c.code.toUpperCase() === String(code).trim().toUpperCase()
  );

  if (!coupon) {
    return sendError(res, 'Invalid promo code. Please check and try again.', 404);
  }

  if (!coupon.isActive) {
    return sendError(res, 'This promo code is no longer active.', 400);
  }

  if (new Date(coupon.expiryDate) < new Date()) {
    return sendError(res, 'This promo code has expired.', 400);
  }

  if (coupon.departmentId && departmentId && coupon.departmentId !== departmentId) {
    return sendError(res, 'This promo code is not applicable to the items in your bag.', 400);
  }

  const orderSubtotal = Number(subtotal) || 0;
  if (orderSubtotal < coupon.minOrderValue) {
    return sendError(
      res,
      `Minimum order value of ₹${coupon.minOrderValue.toLocaleString('en-IN')} required for this offer.`,
      400
    );
  }

  let discountAmount = 0;
  if (coupon.discountType === 'PERCENTAGE') {
    const rawDiscount = (orderSubtotal * coupon.discountValue) / 100;
    discountAmount = coupon.maxDiscount ? Math.min(rawDiscount, coupon.maxDiscount) : rawDiscount;
  } else {
    discountAmount = coupon.discountValue;
  }

  return sendSuccess(res, {
    code: coupon.code,
    description: coupon.description,
    discountAmount: Math.round(discountAmount * 100) / 100,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue
  }, 'Coupon applied successfully!');
});

// Get active public promotions
router.get('/active', (req: Request, res: Response) => {
  const active = store.coupons.filter(c => c.isActive && new Date(c.expiryDate) >= new Date());
  return sendSuccess(res, active, 'Active coupons retrieved');
});

// Admin CRUD
router.get('/', authenticateToken, requireRoles('SUPER_ADMIN'), (req: Request, res: Response) => {
  return sendSuccess(res, store.coupons, 'All coupons');
});

router.post('/', authenticateToken, requireRoles('SUPER_ADMIN'), (req: Request, res: Response) => {
  const { code, description, discountType, discountValue, maxDiscount, minOrderValue, expiryDate, departmentId } = req.body;
  if (!code || !discountValue) {
    return sendError(res, 'Code and discountValue required', 400);
  }

  const newCoupon = {
    id: `cp-${Date.now()}`,
    code: String(code).trim().toUpperCase(),
    description: description || '',
    discountType: discountType || 'PERCENTAGE',
    discountValue: Number(discountValue),
    maxDiscount: maxDiscount ? Number(maxDiscount) : null,
    minOrderValue: Number(minOrderValue) || 0,
    startDate: new Date().toISOString(),
    expiryDate: expiryDate ? new Date(expiryDate).toISOString() : new Date(Date.now() + 86400000 * 30).toISOString(),
    isActive: true,
    departmentId: departmentId || null,
    timesUsed: 0
  };

  store.coupons.unshift(newCoupon);
  return sendSuccess(res, newCoupon, 'Coupon created', 201);
});

router.put('/:id', authenticateToken, requireRoles('SUPER_ADMIN'), (req: Request, res: Response) => {
  const index = store.coupons.findIndex(c => c.id === req.params.id);
  if (index === -1) return sendError(res, 'Coupon not found', 404);
  store.coupons[index] = { ...store.coupons[index], ...req.body };
  return sendSuccess(res, store.coupons[index], 'Coupon updated');
});

router.delete('/:id', authenticateToken, requireRoles('SUPER_ADMIN'), (req: Request, res: Response) => {
  const index = store.coupons.findIndex(c => c.id === req.params.id);
  if (index === -1) return sendError(res, 'Coupon not found', 404);
  store.coupons.splice(index, 1);
  return sendSuccess(res, null, 'Coupon deleted');
});

export default router;
