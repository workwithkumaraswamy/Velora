import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  databaseUrl: process.env.DATABASE_URL || 'mysql://velora_user:VeloraPass2026@localhost:3306/velora_db',

  jwt: {
    secret: process.env.JWT_SECRET || 'velora_jwt_secret_key_luxury_fashion_2026_super_secure',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'velora_jwt_refresh_secret_luxury_fashion_2026_secure',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_velora_2026_mock',
    keySecret: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_velora_mock_luxury_dev',
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'velora-fashion',
    apiKey: process.env.CLOUDINARY_API_KEY || '123456789012345',
    apiSecret: process.env.CLOUDINARY_API_SECRET || 'mock_cloudinary_secret',
  },

  smtp: {
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT || '2525', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || '"VÉLORA Concierge" <concierge@velorafashion.com>',
  },

  shipping: {
    freeShippingThreshold: parseInt(process.env.FREE_SHIPPING_THRESHOLD || '1499', 10),
    standardShippingFee: parseInt(process.env.STANDARD_SHIPPING_FEE || '99', 10),
    estimatedDeliveryDays: 4,
  },

  ai: {
    defaultProvider: process.env.AI_DEFAULT_PROVIDER || 'LOCAL_RULE_BASED',
    huggingFaceKey: process.env.HUGGINGFACE_API_KEY || '',
    stableDiffusionKey: process.env.STABLE_DIFFUSION_API_KEY || '',
    openAiKey: process.env.OPENAI_API_KEY || '',
  }
};
