import { PrismaClient } from '@prisma/client';
import { config } from '../config';

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: config.databaseUrl,
    },
  },
  log: config.nodeEnv === 'development' ? ['warn', 'error'] : ['error'],
});

let isDbConnected = false;

export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    isDbConnected = true;
    console.log('✅ Connected to MySQL 8 Database successfully.');
    return true;
  } catch (err: any) {
    isDbConnected = false;
    console.log('ℹ️  MySQL not directly reachable on localhost:3306. Utilizing VÉLORA Luxury In-Memory Data Engine with pre-seeded catalog.');
    return false;
  }
};

export const getDbStatus = () => isDbConnected;
