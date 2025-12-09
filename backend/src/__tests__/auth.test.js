const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/auth');
const User = require('../models/User');

// Mock User model
jest.mock('../models/User');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      User.findOne.mockResolvedValue(null);
      User.prototype.save = jest.fn().mockResolvedValue({
        _id: '123',
        name: 'Test User',
        email: 'test@example.com',
      });

      const response = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should reject invalid email', async () => {
      const response = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid email');
    });

    it('should reject short password', async () => {
      const response = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: '123',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('at least 6 characters');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login existing user', async () => {
      const mockUser = {
        _id: '123',
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: '$2a$10$hashedpassword',
      };

      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should reject invalid credentials', async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(401);
    });
  });
});
