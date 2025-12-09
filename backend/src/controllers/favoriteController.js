const Favorite = require('../models/Favorite');

const addFavorite = async (req, res) => {
  try {
    const { recipe } = req.body;

    if (!recipe) {
      return res.status(400).json({ error: 'Recipe is required' });
    }

    const favorite = new Favorite({
      user: req.userId,
      recipe,
      mood: recipe.moodMatchedBy || '',
    });

    await favorite.save();
    res.status(201).json(favorite);
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Failed to save favorite' });
  }
};

const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(favorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};

const deleteFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    const favorite = await Favorite.findOneAndDelete({ _id: id, user: req.userId });

    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ msg: 'Deleted' });
  } catch (error) {
    console.error('Delete favorite error:', error);
    res.status(500).json({ error: 'Failed to delete favorite' });
  }
};

module.exports = { addFavorite, getFavorites, deleteFavorite };
