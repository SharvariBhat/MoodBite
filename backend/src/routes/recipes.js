const express = require('express');
const { generateRecipes } = require('../controllers/recipeController');
const { addFavorite, getFavorites, deleteFavorite } = require('../controllers/favoriteController');
const { generateShoppingList } = require('../controllers/shoppingController');
const authMiddleware = require('../middleware/auth');
const { validateRecipeRequest } = require('../middleware/validate');

const router = express.Router();

// Recipe generation
router.post('/generate', authMiddleware, validateRecipeRequest, generateRecipes);

// Favorites
router.post('/favorite', authMiddleware, addFavorite);
router.get('/favorite', authMiddleware, getFavorites);
router.delete('/favorite/:id', authMiddleware, deleteFavorite);

// Shopping list
router.post('/shopping-list', authMiddleware, generateShoppingList);

module.exports = router;
