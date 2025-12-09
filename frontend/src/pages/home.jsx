import React from 'react';
import MoodSelector from '../components/MoodSelector';
import RecipeCard from '../components/RecipeCard';
import { recipes } from '../api';

export default function Home({ user }) {
  const [recipeList, setRecipeList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [favorites, setFavorites] = React.useState([]);
  const [showShoppingList, setShowShoppingList] = React.useState(false);
  const [shoppingList, setShoppingList] = React.useState(null);
  const [selectedRecipes, setSelectedRecipes] = React.useState(new Set());

  React.useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      const fav = await recipes.getFavorites();
      setFavorites(fav.map((f) => f.recipe.id));
    } catch (err) {
      console.error('Failed to load favorites:', err);
    }
  };

  const handleGenerate = async (mood, diet, time, difficulty, cuisine) => {
    if (!user) {
      alert('Please login to generate recipes');
      return;
    }

    setLoading(true);
    setError('');
    setRecipeList([]);
    setSelectedRecipes(new Set());

    try {
      const result = await recipes.generate(mood, diet, time, difficulty, cuisine);
      setRecipeList(result);
    } catch (err) {
      setError(err.message || 'Failed to generate recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async (recipe) => {
    try {
      await recipes.addFavorite(recipe);
      setFavorites([...favorites, recipe.id]);
    } catch (err) {
      alert('Failed to save recipe: ' + err.message);
    }
  };

  const handleToggleRecipe = (recipeId) => {
    const newSelected = new Set(selectedRecipes);
    if (newSelected.has(recipeId)) {
      newSelected.delete(recipeId);
    } else {
      newSelected.add(recipeId);
    }
    setSelectedRecipes(newSelected);
  };

  const handleGenerateShoppingList = async () => {
    if (selectedRecipes.size === 0) {
      alert('Please select at least one recipe');
      return;
    }

    try {
      const selectedRecipeObjects = recipeList.filter((r) => selectedRecipes.has(r.id));
      const list = await recipes.getShoppingList(selectedRecipeObjects);
      setShoppingList(list);
      setShowShoppingList(true);
    } catch (err) {
      alert('Failed to generate shopping list: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-warm text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Cook by Mood</h2>
          <p className="text-lg opacity-90">Tell us how you feel, and we'll suggest the perfect recipe</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-center">
            <p className="text-blue-800">
              <strong>Welcome!</strong> Please login or register to generate personalized recipes.
            </p>
          </div>
        )}

        {user && <MoodSelector onGenerate={handleGenerate} loading={loading} />}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-800">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Recipes Grid */}
        {recipeList.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Your Recipes</h3>
              <div className="flex gap-2">
                <span className="text-sm text-gray-600">
                  {selectedRecipes.size} selected
                </span>
                <button
                  onClick={handleGenerateShoppingList}
                  disabled={selectedRecipes.size === 0}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded font-semibold transition disabled:opacity-50"
                  aria-label="Generate shopping list"
                >
                  🛒 Shopping List
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {recipeList.map((recipe) => (
                <div key={recipe.id} className="relative">
                  <input
                    type="checkbox"
                    checked={selectedRecipes.has(recipe.id)}
                    onChange={() => handleToggleRecipe(recipe.id)}
                    className="absolute top-4 left-4 w-5 h-5 z-10 cursor-pointer"
                    aria-label={`Select ${recipe.title}`}
                  />
                  <RecipeCard
                    recipe={recipe}
                    onSave={handleSaveRecipe}
                    isFavorite={favorites.includes(recipe.id)}
                    user={user}
                  />
                </div>
              ))}
            </div>

            {/* Shopping List Modal */}
            {showShoppingList && shoppingList && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold">Shopping List</h3>
                    <button
                      onClick={() => setShowShoppingList(false)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                      aria-label="Close shopping list"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(shoppingList).map(([category, items]) =>
                      items.length > 0 ? (
                        <div key={category}>
                          <h4 className="font-bold text-primary-600 mb-2 capitalize">{category}</h4>
                          <ul className="space-y-1">
                            {items.map((item, idx) => (
                              <li key={idx} className="text-gray-700 flex items-center">
                                <input type="checkbox" className="mr-2" aria-label={`Check off ${item}`} />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null
                    )}
                  </div>

                  <button
                    onClick={() => setShowShoppingList(false)}
                    className="w-full mt-6 bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 rounded transition"
                    aria-label="Close shopping list"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && recipeList.length === 0 && !error && user && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Select your mood and filters to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
