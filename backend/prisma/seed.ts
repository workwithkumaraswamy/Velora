import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding VÉLORA Luxury Database...');

  const salt = bcrypt.genSaltSync(10);
  const adminPassword = bcrypt.hashSync('VeloraAdmin2026!', salt);

  // 1. Seed Roles & Users
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@velora.com' },
    update: {},
    create: {
      email: 'admin@velora.com',
      phone: '+919876543210',
      passwordHash: adminPassword,
      firstName: 'Aarav',
      lastName: 'Singhania',
      role: 'SUPER_ADMIN',
      isActive: true,
      emailVerified: true,
    },
  });

  console.log(`✅ Admin seeded: ${superAdmin.email}`);

  // 2. Seed Departments
  const departments = [
    {
      name: 'Men',
      slug: 'men',
      description: 'Sophisticated tailoring, timeless essentials and contemporary luxury for the modern gentleman.',
      heroBanner: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=1600&auto=format&fit=crop&q=85',
      heroSubtitle: 'The Autumn/Winter Heritage & Sartorial Collection',
      sortOrder: 1,
    },
    {
      name: 'Women',
      slug: 'women',
      description: 'Ethereal silhouettes, modern couture, bespoke accessories and elevated everyday luxury.',
      heroBanner: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=85',
      heroSubtitle: 'Effortless Elegance & Haute Craftsmanship',
      sortOrder: 2,
    },
    {
      name: 'Kids',
      slug: 'kids',
      description: 'Charming festive ensembles, joyful comfort and premium organic wear for young tastemakers.',
      heroBanner: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=1600&auto=format&fit=crop&q=85',
      heroSubtitle: 'Playful Comfort Meets Pristine Tailoring',
      sortOrder: 3,
    },
  ];

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { slug: dept.slug },
      update: {},
      create: dept,
    });
  }

  console.log('✅ Departments seeded: Men, Women, Kids');
  console.log('✨ Database seeding complete.');
}

main()
  .catch((e) => {
    console.error('Seeding notice (MySQL offline or unconfigured):', e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
