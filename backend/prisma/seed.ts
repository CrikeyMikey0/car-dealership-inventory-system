import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  // Hash passwords
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('AdminPassword123!', salt);
  const userPasswordHash = await bcrypt.hash('UserPassword123!', salt);

  // Seed Users
  const adminUser = await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: 'admin@dealership.com',
      password: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: userPasswordHash,
      role: 'USER',
    },
  });

  console.log('Seeded Users:');
  console.log(`- Admin: ${adminUser.email}`);
  console.log(`- User: ${regularUser.email}`);

  // Seed Vehicles
  const vehicles = [
    {
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      category: 'Electric',
      price: 42990.00,
      quantity: 3,
      imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071&auto=format&fit=crop'
    },
    {
      make: 'Ford',
      model: 'Mustang',
      year: 2024,
      category: 'Coupe',
      price: 55500.00,
      quantity: 2,
      imageUrl: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?q=80&w=2070&auto=format&fit=crop'
    },
    {
      make: 'Ford',
      model: 'F-150',
      year: 2022,
      category: 'Truck',
      price: 38500.00,
      quantity: 5,
    },
    {
      make: 'Toyota',
      model: 'RAV4',
      year: 2021,
      category: 'SUV',
      price: 28250.00,
      quantity: 10,
    },
    {
      make: 'Honda',
      model: 'Civic',
      year: 2022,
      category: 'Sedan',
      price: 25000.00,
      quantity: 8,
      imageUrl: 'https://images.unsplash.com/photo-1590362891991-f700445d3121?q=80&w=2069&auto=format&fit=crop'
    },
  ];

  for (const vehicle of vehicles) {
    await prisma.vehicle.create({
      data: vehicle,
    });
  }

  console.log(`Seeded ${vehicles.length} vehicles.`);
  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
