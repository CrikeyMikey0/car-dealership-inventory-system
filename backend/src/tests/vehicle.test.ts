import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import prisma from '../config/database';
import { generateAccessToken } from '../services/jwt.service';
import { User } from '@prisma/client';

const app = createApp();

describe('Vehicle CRUD and Inventory Tests', () => {
  let adminUser: User;
  let normalUser: User;
  let adminToken: string;
  let userToken: string;

  beforeEach(async () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);

    // Clear databases
    await prisma.vehicle.deleteMany();

    // Create Admin
    adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: `admin_${timestamp}_${random}@example.com`,
        password: 'hashedpassword',
        role: 'ADMIN',
      },
    });
    adminToken = generateAccessToken({ userId: adminUser.id, role: adminUser.role });

    // Create User
    normalUser = await prisma.user.create({
      data: {
        name: 'Normal User',
        email: `user_${timestamp}_${random}@example.com`,
        password: 'hashedpassword',
        role: 'USER',
      },
    });
    userToken = generateAccessToken({ userId: normalUser.id, role: normalUser.role });
  });

  afterAll(async () => {
    await prisma.vehicle.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('Create Vehicle (POST /api/vehicles)', () => {
    const validVehicle = {
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      category: 'Sedan',
      price: 25000,
      quantity: 5,
    };

    it('should successfully create a new vehicle when authorized as ADMIN', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validVehicle);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.make).toBe(validVehicle.make);
      expect(res.body.data.model).toBe(validVehicle.model);
      expect(res.body.data.year).toBe(validVehicle.year);
      expect(res.body.data.category).toBe(validVehicle.category);
      expect(Number(res.body.data.price)).toBe(validVehicle.price);
      expect(res.body.data.quantity).toBe(validVehicle.quantity);
    });

    it('should reject access with 403 Forbidden when requested as USER', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validVehicle);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/forbidden|permission/i);
    });

    it('should reject access with 401 Unauthorized when unauthenticated', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .send(validVehicle);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 Bad Request and validation errors for invalid payload', async () => {
      const invalidVehicle = {
        make: '', // blank
        model: 'Camry',
        year: 1800, // too old
        category: 'Sedan',
        price: -500, // negative price
        quantity: -1, // negative quantity
      };

      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidVehicle);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.length).toBeGreaterThanOrEqual(4); // make, year, price, quantity
    });
  });

  describe('Get Vehicle By ID (GET /api/vehicles/:id)', () => {
    let createdVehicleId: string;

    beforeEach(async () => {
      const v = await prisma.vehicle.create({
        data: {
          make: 'Honda',
          model: 'Civic',
          year: 2021,
          category: 'Sedan',
          price: 22000,
          quantity: 3,
        },
      });
      createdVehicleId = v.id;
    });

    it('should successfully retrieve vehicle by ID when authenticated', async () => {
      const res = await request(app)
        .get(`/api/vehicles/${createdVehicleId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.id).toBe(createdVehicleId);
      expect(res.body.data.make).toBe('Honda');
    });

    it('should reject access with 401 Unauthorized when unauthenticated', async () => {
      const res = await request(app).get(`/api/vehicles/${createdVehicleId}`);
      expect(res.status).toBe(401);
    });

    it('should return 404 Not Found for non-existent vehicle ID', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const res = await request(app)
        .get(`/api/vehicles/${nonExistentId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/not found/i);
    });
  });

  describe('Get All Vehicles (GET /api/vehicles)', () => {
    beforeEach(async () => {
      // Seed several vehicles for pagination, filtering and sorting
      await prisma.vehicle.createMany({
        data: [
          { make: 'Toyota', model: 'Corolla', year: 2020, category: 'Sedan', price: 20000, quantity: 4 },
          { make: 'Toyota', model: 'RAV4', year: 2021, category: 'SUV', price: 30000, quantity: 2 },
          { make: 'Honda', model: 'Civic', year: 2022, category: 'Sedan', price: 22000, quantity: 0 }, // Out of stock
          { make: 'Ford', model: 'Mustang', year: 2019, category: 'Coupe', price: 35000, quantity: 1 },
          { make: 'Ford', model: 'F-150', year: 2020, category: 'Truck', price: 40000, quantity: 5 },
        ],
      });
    });

    it('should retrieve a paginated list of vehicles with metadata', async () => {
      const res = await request(app)
        .get('/api/vehicles?page=1&limit=2')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.data).toHaveLength(2);
      expect(res.body.data.page).toBe(1);
      expect(res.body.data.limit).toBe(2);
      expect(res.body.data.total).toBe(5);
      expect(res.body.data.totalPages).toBe(3);
    });

    it('should reject access with 401 Unauthorized when unauthenticated', async () => {
      const res = await request(app).get('/api/vehicles');
      expect(res.status).toBe(401);
    });

    it('should support filtering by make, category, price range, and availability', async () => {
      // Test filter: Sedan make Toyota
      const res1 = await request(app)
        .get('/api/vehicles?make=Toyota&category=Sedan')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res1.status).toBe(200);
      expect(res1.body.data.data).toHaveLength(1);
      expect(res1.body.data.data[0].model).toBe('Corolla');

      // Test price range: price 21000 to 31000
      const res2 = await request(app)
        .get('/api/vehicles?minPrice=21000&maxPrice=31000')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res2.body.data.data).toHaveLength(2); // Honda Civic (22000), Toyota RAV4 (30000)

      // Test availability: available=true (quantity > 0)
      const res3 = await request(app)
        .get('/api/vehicles?availability=true')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res3.body.data.data).toHaveLength(4); // Excludes Civic since quantity=0

      // Test availability: available=false (quantity = 0)
      const res4 = await request(app)
        .get('/api/vehicles?availability=false')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res4.body.data.data).toHaveLength(1); // Only Civic (quantity = 0)
    });

    it('should support sorting by price descending', async () => {
      const res = await request(app)
        .get('/api/vehicles?sortBy=price&sortOrder=desc')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      const prices = res.body.data.data.map((v: { price: string | number }) => Number(v.price));
      expect(prices).toEqual([40000, 35000, 30000, 22000, 20000]);
    });

    it('should return 400 Bad Request when pagination parameters are invalid', async () => {
      const res = await request(app)
        .get('/api/vehicles?page=-1&limit=0')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Search Vehicles (GET /api/vehicles/search)', () => {
    beforeEach(async () => {
      await prisma.vehicle.createMany({
        data: [
          { make: 'Toyota', model: 'Corolla', year: 2020, category: 'Sedan', price: 20000, quantity: 4 },
          { make: 'Honda', model: 'Civic', year: 2022, category: 'Sedan', price: 22000, quantity: 3 },
          { make: 'Ford', model: 'Mustang', year: 2019, category: 'Coupe', price: 35000, quantity: 1 },
        ],
      });
    });

    it('should successfully search by make case-insensitively', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?make=toyota')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].make).toBe('Toyota');
    });

    it('should successfully search by model case-insensitively', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?model=civic')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].model).toBe('Civic');
    });

    it('should successfully search by category case-insensitively', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?category=sedan')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
    });

    it('should successfully search by price range', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?minPrice=21000&maxPrice=36000')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2); // Civic (22000), Mustang (35000)
    });

    it('should successfully search by keyword matching make, model, or category case-insensitively', async () => {
      // keyword matches make 'Ford'
      const res1 = await request(app)
        .get('/api/vehicles/search?keyword=ford')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res1.status).toBe(200);
      expect(res1.body.data).toHaveLength(1);
      expect(res1.body.data[0].make).toBe('Ford');

      // keyword matches model 'corolla'
      const res2 = await request(app)
        .get('/api/vehicles/search?keyword=corolla')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res2.status).toBe(200);
      expect(res2.body.data).toHaveLength(1);
      expect(res2.body.data[0].model).toBe('Corolla');

      // keyword matches category 'coupe'
      const res3 = await request(app)
        .get('/api/vehicles/search?keyword=coupe')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res3.status).toBe(200);
      expect(res3.body.data).toHaveLength(1);
      expect(res3.body.data[0].category).toBe('Coupe');
    });

    it('should return empty list when no matches are found', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?keyword=tesla')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(0);
    });

    it('should reject access with 401 Unauthorized when unauthenticated', async () => {
      const res = await request(app).get('/api/vehicles/search?keyword=toyota');
      expect(res.status).toBe(401);
    });
  });

  describe('Update Vehicle (PUT /api/vehicles/:id)', () => {
    let createdVehicleId: string;

    beforeEach(async () => {
      const v = await prisma.vehicle.create({
        data: {
          make: 'Chevrolet',
          model: 'Cruze',
          year: 2018,
          category: 'Sedan',
          price: 15000,
          quantity: 2,
        },
      });
      createdVehicleId = v.id;
    });

    it('should successfully update vehicle details when authorized as ADMIN', async () => {
      const res = await request(app)
        .put(`/api/vehicles/${createdVehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          price: 16500,
          quantity: 3,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Number(res.body.data.price)).toBe(16500);
      expect(res.body.data.quantity).toBe(3);
      expect(res.body.data.make).toBe('Chevrolet'); // Unchanged fields remain
    });

    it('should reject access with 403 Forbidden when requested as USER', async () => {
      const res = await request(app)
        .put(`/api/vehicles/${createdVehicleId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 16000 });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should reject access with 401 Unauthorized when unauthenticated', async () => {
      const res = await request(app)
        .put(`/api/vehicles/${createdVehicleId}`)
        .send({ price: 16000 });

      expect(res.status).toBe(401);
    });

    it('should return 404 Not Found for non-existent vehicle ID', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const res = await request(app)
        .put(`/api/vehicles/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 16000 });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 Bad Request when validation fails', async () => {
      const res = await request(app)
        .put(`/api/vehicles/${createdVehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: -100 }); // negative price

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Delete Vehicle (DELETE /api/vehicles/:id)', () => {
    let createdVehicleId: string;

    beforeEach(async () => {
      const v = await prisma.vehicle.create({
        data: {
          make: 'Ford',
          model: 'Focus',
          year: 2017,
          category: 'Sedan',
          price: 12000,
          quantity: 1,
        },
      });
      createdVehicleId = v.id;
    });

    it('should successfully delete a vehicle when authorized as ADMIN', async () => {
      const res = await request(app)
        .delete(`/api/vehicles/${createdVehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify it is gone
      const verifyRes = await prisma.vehicle.findUnique({
        where: { id: createdVehicleId },
      });
      expect(verifyRes).toBeNull();
    });

    it('should reject access with 403 Forbidden when requested as USER', async () => {
      const res = await request(app)
        .delete(`/api/vehicles/${createdVehicleId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should reject access with 401 Unauthorized when unauthenticated', async () => {
      const res = await request(app)
        .delete(`/api/vehicles/${createdVehicleId}`);

      expect(res.status).toBe(401);
    });

    it('should return 404 Not Found for non-existent vehicle ID', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const res = await request(app)
        .delete(`/api/vehicles/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Purchase Vehicle (POST /api/vehicles/:id/purchase)', () => {
    let createdVehicleId: string;

    beforeEach(async () => {
      const v = await prisma.vehicle.create({
        data: {
          make: 'Tesla',
          model: 'Model 3',
          year: 2021,
          category: 'Sedan',
          price: 45000,
          quantity: 3,
        },
      });
      createdVehicleId = v.id;
    });

    it('should successfully decrease quantity when authorized user purchases a vehicle', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${createdVehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 2 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.quantity).toBe(1);

      // Verify DB quantity is updated
      const dbVehicle = await prisma.vehicle.findUnique({
        where: { id: createdVehicleId },
      });
      expect(dbVehicle?.quantity).toBe(1);
    });

    it('should reject access with 401 Unauthorized when unauthenticated', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${createdVehicleId}/purchase`)
        .send({ quantity: 1 });

      expect(res.status).toBe(401);
    });

    it('should return 400 Bad Request for negative or zero purchase quantity', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${createdVehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: -1 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);

      const resZero = await request(app)
        .post(`/api/vehicles/${createdVehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 0 });

      expect(resZero.status).toBe(400);
    });

    it('should return 422 Unprocessable Entity when purchase quantity exceeds available inventory', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${createdVehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 4 }); // exceeds 3

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/insufficient|stock|inventory/i);
    });

    it('should return 404 Not Found for non-existent vehicle ID', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const res = await request(app)
        .post(`/api/vehicles/${nonExistentId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(res.status).toBe(404);
    });
  });

  describe('Restock Vehicle (POST /api/vehicles/:id/restock)', () => {
    let createdVehicleId: string;

    beforeEach(async () => {
      const v = await prisma.vehicle.create({
        data: {
          make: 'Toyota',
          model: 'Prius',
          year: 2021,
          category: 'Hybrid',
          price: 28000,
          quantity: 2,
        },
      });
      createdVehicleId = v.id;
    });

    it('should successfully increase quantity when authorized as ADMIN', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${createdVehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.quantity).toBe(7);

      // Verify DB quantity is updated
      const dbVehicle = await prisma.vehicle.findUnique({
        where: { id: createdVehicleId },
      });
      expect(dbVehicle?.quantity).toBe(7);
    });

    it('should reject access with 403 Forbidden when requested as USER', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${createdVehicleId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(403);
    });

    it('should reject access with 401 Unauthorized when unauthenticated', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${createdVehicleId}/restock`)
        .send({ quantity: 5 });

      expect(res.status).toBe(401);
    });

    it('should return 400 Bad Request for negative or zero restock quantity', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${createdVehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: -1 });

      expect(res.status).toBe(400);

      const resZero = await request(app)
        .post(`/api/vehicles/${createdVehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 0 });

      expect(resZero.status).toBe(400);
    });

    it('should return 404 Not Found for non-existent vehicle ID', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const res = await request(app)
        .post(`/api/vehicles/${nonExistentId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(404);
    });
  });
});
