const mongoose = require('mongoose');

const recipeLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mood: {
    type: String,
  },
  queryBody: {
    type: mongoose.Schema.Types.Mixed,
  },
  recipesReturned: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('RecipeLog', recipeLogSchema);
