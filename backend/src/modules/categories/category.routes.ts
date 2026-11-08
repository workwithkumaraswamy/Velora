import { Router, Request, Response } from 'express';
import { store } from '../../utils/store';
import { sendSuccess } from '../../utils/response';

const router = Router();

// Get all departments
router.get('/departments', (req: Request, res: Response) => {
  const departmentsWithCounts = store.departments.map(dept => {
    const categories = store.categories.filter(c => c.departmentId === dept.id);
    const productCount = store.products.filter(p => p.departmentId === dept.id).length;
    return {
      ...dept,
      categories,
      productCount,
    };
  });
  return sendSuccess(res, departmentsWithCounts, 'Departments retrieved');
});

// Get specific department by slug
router.get('/departments/:slug', (req: Request, res: Response) => {
  const slug = req.params.slug.toLowerCase();
  const dept = store.departments.find(d => d.slug === slug);
  if (!dept) {
    return res.status(404).json({ success: false, error: 'Department not found' });
  }
  const categories = store.categories.filter(c => c.departmentId === dept.id);
  const products = store.products.filter(p => p.departmentId === dept.id);
  return sendSuccess(res, { ...dept, categories, productsCount: products.length }, 'Department details');
});

// Get all categories (optional filter by department)
router.get('/categories', (req: Request, res: Response) => {
  const { departmentId, departmentSlug } = req.query;
  let list = [...store.categories];

  if (departmentId) {
    list = list.filter(c => c.departmentId === departmentId);
  } else if (departmentSlug) {
    const dept = store.departments.find(d => d.slug === String(departmentSlug).toLowerCase());
    if (dept) {
      list = list.filter(c => c.departmentId === dept.id);
    }
  }

  return sendSuccess(res, list, 'Categories retrieved');
});

// Get all brands
router.get('/brands', (req: Request, res: Response) => {
  return sendSuccess(res, store.brands, 'Brands retrieved');
});

export default router;
