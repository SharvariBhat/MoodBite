const generateShoppingList = async (req, res) => {
  try {
    const { recipes } = req.body;

    if (!recipes || !Array.isArray(recipes) || recipes.length === 0) {
      return res.status(400).json({ error: 'Recipes array is required' });
    }

    // Categorize ingredients
    const categories = {
      produce: [],
      dairy: [],
      spices: [],
      proteins: [],
      grains: [],
      others: [],
    };

    const categoryKeywords = {
      produce: ['tomato', 'onion', 'garlic', 'carrot', 'lettuce', 'spinach', 'broccoli', 'pepper', 'cucumber', 'apple', 'banana', 'lemon', 'lime', 'potato', 'bean', 'pea', 'corn', 'mushroom', 'herb', 'basil', 'parsley', 'cilantro', 'mint', 'ginger', 'chili'],
      dairy: ['milk', 'cheese', 'butter', 'yogurt', 'cream', 'egg', 'ghee', 'paneer'],
      spices: ['salt', 'pepper', 'cumin', 'turmeric', 'paprika', 'cinnamon', 'nutmeg', 'clove', 'cardamom', 'chili powder', 'garam masala', 'oregano', 'thyme', 'bay leaf'],
      proteins: ['chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'shrimp', 'tofu', 'lentil', 'chickpea', 'bean', 'meat'],
      grains: ['rice', 'wheat', 'flour', 'bread', 'pasta', 'noodle', 'oat', 'quinoa', 'barley'],
    };

    const categorizeIngredient = (ingredient) => {
      const lower = ingredient.toLowerCase();
      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some((keyword) => lower.includes(keyword))) {
          return category;
        }
      }
      return 'others';
    };

    // Collect all ingredients
    recipes.forEach((recipe) => {
      if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
        recipe.ingredients.forEach((ingredient) => {
          const category = categorizeIngredient(ingredient);
          if (!categories[category].includes(ingredient)) {
            categories[category].push(ingredient);
          }
        });
      }
    });

    res.json(categories);
  } catch (error) {
    console.error('Generate shopping list error:', error);
    res.status(500).json({ error: 'Failed to generate shopping list' });
  }
};

module.exports = { generateShoppingList };
