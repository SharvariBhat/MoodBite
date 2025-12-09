import React from 'react';
import RecipeCard from '../components/RecipeCard';
import { recipes } from '../api';

export default function Favorites({ user }) {
  const [favorites, setFavorites] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const result = await recipes.getFavorites();
      setFavorites(result);
    } catch (err) {
      setError(err.message || 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await recipes.deleteFavorite(id);
      setFavorites(favorites.filter((f) => f._id !== id));
    } catch (err) {
      alert('Failed to delete favorite: ' + err.message);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Please login to view your favorites</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-warm text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">❤️ Your Favorites</h2>
          <p className="text-lg opacity-90">Recipes you love</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg h-96 skeleton"></div>
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <div key={fav._id} className="relative">
                <RecipeCard
                  recipe={fav.recipe}
                  onSave={() => {}}
                  isFavorite={true}
                  user={user}
                />
                <button
                  onClick={() => handleDelete(fav._id)}
                  className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition"
                  aria-label="Delete favorite"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No favorites yet. Start by generating some recipes!</p>
          </div>
        )}
      </div>
    </div>
  );
}
