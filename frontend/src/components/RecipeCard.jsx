import React from 'react';

export default function RecipeCard({ recipe, onSave, onViewSteps, isFavorite, user }) {
  const [showSteps, setShowSteps] = React.useState(false);

  const handleSave = () => {
    if (!user) {
      alert('Please login to save favorites');
      return;
    }
    onSave(recipe);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition animate-fade-in">
      {/* Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {recipe.image ? (
          <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          {recipe.difficulty === 'beginner' && <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">Easy</span>}
          {recipe.difficulty === 'medium' && <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">Medium</span>}
          {recipe.difficulty === 'hard' && <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">Hard</span>}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{recipe.title}</h3>

        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span>⏱️ {recipe.prep_time_minutes} min</span>
          <span>🔥 {recipe.calories}</span>
        </div>

        {/* Macros */}
        {recipe.macros && (
          <div className="grid grid-cols-3 gap-2 mb-4 text-xs bg-gray-50 p-2 rounded">
            <div className="text-center">
              <div className="font-semibold text-primary-600">{recipe.macros.protein}g</div>
              <div className="text-gray-600">Protein</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-primary-600">{recipe.macros.carbs}g</div>
              <div className="text-gray-600">Carbs</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-primary-600">{recipe.macros.fat}g</div>
              <div className="text-gray-600">Fat</div>
            </div>
          </div>
        )}

        {/* Ingredients Preview */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Ingredients:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            {recipe.ingredients.slice(0, 3).map((ing, idx) => (
              <li key={idx}>• {ing}</li>
            ))}
            {recipe.ingredients.length > 3 && <li className="text-primary-600 font-semibold">+{recipe.ingredients.length - 3} more</li>}
          </ul>
        </div>

        {/* Steps Toggle */}
        <button
          onClick={() => setShowSteps(!showSteps)}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 rounded mb-4 transition"
          aria-label="Toggle cooking steps"
        >
          {showSteps ? '▼ Hide Steps' : '▶ Cook Mode'}
        </button>

        {showSteps && (
          <div className="mb-4 bg-blue-50 p-3 rounded">
            <ol className="text-sm text-gray-700 space-y-2">
              {recipe.steps.map((step, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="font-bold text-primary-600 flex-shrink-0">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* YouTube Video */}
        {recipe.youtube && (
          <a
            href={recipe.youtube.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded mb-4 text-center transition"
            aria-label={`Watch ${recipe.youtube.title} on YouTube`}
          >
            ▶️ Watch on YouTube
          </a>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!user}
          className={`w-full font-semibold py-2 rounded transition ${
            isFavorite
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
          } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={!user ? 'Login to save favorites' : ''}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '❤️ Saved' : '🤍 Save'}
        </button>
      </div>
    </div>
  );
}
