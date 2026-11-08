import { Router, Request, Response } from 'express';
import { store } from '../../utils/store';
import { sendSuccess, sendError } from '../../utils/response';
import { authenticateToken } from '../../middleware/auth';
import { AuthenticatedRequest } from '../../middleware/auth';

const router = Router();

// Get reviews for a specific product
router.get('/product/:productId', (req: Request, res: Response) => {
  const reviews = store.reviews.filter(r => r.productId === req.params.productId);
  const total = reviews.length;
  const avg = total > 0 
    ? Math.round((reviews.reduce((acc, r) => acc + r.rating, 0) / total) * 10) / 10 
    : 0;

  return sendSuccess(res, {
    reviews,
    averageRating: avg,
    totalReviews: total,
    distribution: {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    }
  }, 'Reviews retrieved');
});

// Post a review (authenticated buyer)
router.post('/product/:productId', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { rating, title, comment, photos } = req.body;
  const productId = req.params.productId;

  if (!rating || !comment) {
    return sendError(res, 'Rating and comment are required', 400);
  }

  const user = store.users.find(u => u.id === req.user?.userId);

  const newReview = {
    id: `rev-${Date.now()}`,
    productId,
    userId: req.user?.userId || 'usr-cust-1',
    user: {
      firstName: user?.firstName || 'Valued',
      lastName: user?.lastName || 'Patron',
      avatar: user?.avatar
    },
    rating: Number(rating),
    title: title || '',
    comment,
    photos: photos || [],
    isVerifiedPurchase: true,
    isApproved: true,
    createdAt: new Date().toISOString()
  };

  store.reviews.unshift(newReview);

  // Update product's average rating & review count
  const product = store.products.find(p => p.id === productId);
  if (product) {
    const prodReviews = store.reviews.filter(r => r.productId === productId);
    product.reviewCount = prodReviews.length;
    product.averageRating = Math.round((prodReviews.reduce((a, r) => a + r.rating, 0) / prodReviews.length) * 10) / 10;
  }

  return sendSuccess(res, newReview, 'Review submitted successfully', 201);
});

export default router;
