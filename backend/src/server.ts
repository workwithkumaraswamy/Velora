import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { checkDatabaseConnection } from './prisma/client';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Route modules
import authRoutes from './modules/auth/auth.routes';
import productRoutes from './modules/products/product.routes';
import categoryRoutes from './modules/categories/category.routes';
import supplierRoutes from './modules/suppliers/supplier.routes';
import orderRoutes from './modules/orders/order.routes';
import couponRoutes from './modules/coupons/coupon.routes';
import aiRoutes from './modules/ai/ai.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import reviewRoutes from './modules/reviews/review.routes';
import returnRoutes from './modules/returns/return.routes';
import supportRoutes from './modules/support/support.routes';
import bannerRoutes from './modules/banners/banner.routes';
import userRoutes from './modules/users/user.routes';

const app = express();

// Security and utility middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Rate Limiting (relaxed for development)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests from this client, please try again after 15 minutes' }
});
app.use(config.apiPrefix, apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    brand: 'VÉLORA',
    tagline: 'Fashion Without Limits',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    version: '1.0.0'
  });
});

// Mount API Modules
app.use(`${config.apiPrefix}/auth`, authRoutes);
app.use(`${config.apiPrefix}/products`, productRoutes);
app.use(`${config.apiPrefix}/catalog`, categoryRoutes);
app.use(`${config.apiPrefix}/suppliers`, supplierRoutes);
app.use(`${config.apiPrefix}/orders`, orderRoutes);
app.use(`${config.apiPrefix}/coupons`, couponRoutes);
app.use(`${config.apiPrefix}/ai`, aiRoutes);
app.use(`${config.apiPrefix}/analytics`, analyticsRoutes);
app.use(`${config.apiPrefix}/reviews`, reviewRoutes);
app.use(`${config.apiPrefix}/returns`, returnRoutes);
app.use(`${config.apiPrefix}/support`, supportRoutes);
app.use(`${config.apiPrefix}/banners`, bannerRoutes);
app.use(`${config.apiPrefix}/users`, userRoutes);

// 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

let activeServer: any = null;

export const startServer = async (portToUse: number = config.port) => {
  if (activeServer) {
    return { app, server: activeServer };
  }

  // Check database connectivity
  await checkDatabaseConnection();

  return new Promise<{ app: typeof app; server: any }>((resolve) => {
    activeServer = app.listen(portToUse, () => {
      console.log(`
╔═════════════════════════════════════════════════════════════════╗
║                      V É L O R A                                ║
║             Fashion Without Limits — API Server                 ║
╠═════════════════════════════════════════════════════════════════╣
║  • Status: Online & Serving                                     ║
║  • Port: ${portToUse}                                                   ║
║  • Base API: http://localhost:${portToUse}${config.apiPrefix}                    ║
║  • Health Check: http://localhost:${portToUse}/health                    ║
║  • Luxury Engine: Ready with Men, Women & Kids Catalog          ║
╚═════════════════════════════════════════════════════════════════╝
      `);
      resolve({ app, server: activeServer });
    });
  });
};

if (!process.env.TEST_MODE && process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
