const request = require('supertest');
const express = require('express');
const recipeRoutes = require('../routes/recipes');
const authMiddleware = require('../middleware/auth');

// Mock modules
jest.mock('../middleware/auth');
jest.mock('../models/RecipeLog');
jest.mock('@google/generative-ai');

const app = express();
app.use(express.json());

// Mock auth middleware to pass through
authMiddleware.mockImplementation((req, res, next) => {
  req.userId = 'test-user-id';
  next();
});

app.use('/api/recipes', recipeRoutes);

describe('Recipe Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/recipes/generate', () => {
    it('should require mood parameter', async () => {
      const response = await request(app).post('/api/recipes/generate').send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Mood is required');
    });

    it('should reject empty mood', async () => {
      const response = await request(app).post('/api/recipes/generate').send({
        mood: '',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/recipes/favorite', () => {
    it('should require recipe parameter', async () => {
      const response = await request(app).post('/api/recipes/favorite').send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Recipe is required');
    });
  });

  describe('POST /api/recipes/shopping-list', () => {
    it('should require recipes array', async () => {
      const response = await request(app).post('/api/recipes/shopping-list').send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Recipes array is required');
    });

    it('should categorize ingredients', async () => {
      const response = await request(app).post('/api/recipes/shopping-list').send({
        recipes: [
          {
            title: 'Salad',
            ingredients: ['tomato', 'lettuce', 'olive oil'],
          },
        ],
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('produce');
      expect(response.body.produce).toContain('tomato');
    });
  });
});
