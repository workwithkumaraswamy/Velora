import { Router, Request, Response } from 'express';
import { store } from '../../utils/store';
import { sendSuccess, sendError } from '../../utils/response';
import { authenticateToken, requireRoles } from '../../middleware/auth';

const router = Router();

// Public get active banners
router.get('/', (req: Request, res: Response) => {
  const { department, placement } = req.query;
  let list = store.banners.filter(b => b.isActive);

  if (department && department !== 'all') {
    list = list.filter(b => b.department === department || b.department === 'all');
  }
  if (placement) {
    list = list.filter(b => b.placement === placement);
  }

  return sendSuccess(res, list, 'Active banners retrieved');
});

// Admin update/create banners
router.post('/', authenticateToken, requireRoles('SUPER_ADMIN'), (req: Request, res: Response) => {
  const newBanner = {
    id: `ban-${Date.now()}`,
    title: req.body.title,
    subtitle: req.body.subtitle || '',
    targetUrl: req.body.targetUrl || '/men',
    imageUrl: req.body.imageUrl,
    department: req.body.department || 'all',
    placement: req.body.placement || 'HERO',
    isActive: true,
    sortOrder: Number(req.body.sortOrder) || 1
  };
  store.banners.push(newBanner);
  return sendSuccess(res, newBanner, 'Banner created', 201);
});

router.put('/:id', authenticateToken, requireRoles('SUPER_ADMIN'), (req: Request, res: Response) => {
  const index = store.banners.findIndex(b => b.id === req.params.id);
  if (index === -1) return sendError(res, 'Banner not found', 404);
  store.banners[index] = { ...store.banners[index], ...req.body };
  return sendSuccess(res, store.banners[index], 'Banner updated');
});

router.delete('/:id', authenticateToken, requireRoles('SUPER_ADMIN'), (req: Request, res: Response) => {
  const index = store.banners.findIndex(b => b.id === req.params.id);
  if (index === -1) return sendError(res, 'Banner not found', 404);
  store.banners.splice(index, 1);
  return sendSuccess(res, null, 'Banner deleted');
});

export default router;
