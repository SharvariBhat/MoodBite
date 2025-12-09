import React from 'react';
import { planner } from '../api';

const MOODS = ['happy', 'cozy', 'energetic', 'calm', 'adventurous', 'healthy'];
const DIETS = ['both', 'veg', 'non-veg', 'vegan', 'keto', 'pescatarian'];

export default function Planner({ user }) {
  const [weekPlan, setWeekPlan] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [mood, setMood] = React.useState('healthy');
  const [diet, setDiet] = React.useState('both');
  const [days, setDays] = React.useState(7);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await planner.generateWeek(mood, days, diet);
      setWeekPlan(result);
    } catch (err) {
      setError(err.message || 'Failed to generate meal plan');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Please login to use the meal planner</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-warm text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">📅 Weekly Meal Planner</h2>
          <p className="text-lg opacity-90">Plan your week ahead</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Generator */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Generate Your Plan</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mood</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Select mood for meal plan"
              >
                {MOODS.map((m) => (
                  <option key={m} value={m}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Diet</label>
              <select
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Select diet preference"
              >
                {DIETS.map((d) => (
                  <option key={d} value={d}>
                    {d.charAt(0).toUpperCase() + d.slice(1).replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Days</label>
              <select
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Select number of days"
              >
                <option value={3}>3 Days</option>
                <option value={5}>5 Days</option>
                <option value={7}>7 Days</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-gradient-warm text-white font-bold py-2 rounded-lg hover:shadow-lg transition disabled:opacity-50"
                aria-label="Generate meal plan"
              >
                {loading ? 'Generating...' : '✨ Generate'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              {error}
            </div>
          )}
        </div>

        {/* Meal Plan Display */}
        {weekPlan && (
          <div className="space-y-6">
            {weekPlan.map((dayPlan, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-primary-100 px-6 py-4 border-l-4 border-primary-500">
                  <h3 className="text-2xl font-bold text-gray-800">{dayPlan.day}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                  {/* Breakfast */}
                  <div className="border-l-4 border-yellow-400 pl-4">
                    <h4 className="font-bold text-lg text-gray-800 mb-2">🌅 Breakfast</h4>
                    <p className="font-semibold text-primary-600 mb-2">{dayPlan.breakfast.title}</p>
                    <p className="text-sm text-gray-600 mb-2">⏱️ {dayPlan.breakfast.prep_time_minutes} min</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {dayPlan.breakfast.ingredients.slice(0, 3).map((ing, i) => (
                        <li key={i}>• {ing}</li>
                      ))}
                      {dayPlan.breakfast.ingredients.length > 3 && (
                        <li className="text-primary-600">+{dayPlan.breakfast.ingredients.length - 3} more</li>
                      )}
                    </ul>
                  </div>

                  {/* Lunch */}
                  <div className="border-l-4 border-orange-400 pl-4">
                    <h4 className="font-bold text-lg text-gray-800 mb-2">🍽️ Lunch</h4>
                    <p className="font-semibold text-primary-600 mb-2">{dayPlan.lunch.title}</p>
                    <p className="text-sm text-gray-600 mb-2">⏱️ {dayPlan.lunch.prep_time_minutes} min</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {dayPlan.lunch.ingredients.slice(0, 3).map((ing, i) => (
                        <li key={i}>• {ing}</li>
                      ))}
                      {dayPlan.lunch.ingredients.length > 3 && (
                        <li className="text-primary-600">+{dayPlan.lunch.ingredients.length - 3} more</li>
                      )}
                    </ul>
                  </div>

                  {/* Dinner */}
                  <div className="border-l-4 border-red-400 pl-4">
                    <h4 className="font-bold text-lg text-gray-800 mb-2">🌙 Dinner</h4>
                    <p className="font-semibold text-primary-600 mb-2">{dayPlan.dinner.title}</p>
                    <p className="text-sm text-gray-600 mb-2">⏱️ {dayPlan.dinner.prep_time_minutes} min</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {dayPlan.dinner.ingredients.slice(0, 3).map((ing, i) => (
                        <li key={i}>• {ing}</li>
                      ))}
                      {dayPlan.dinner.ingredients.length > 3 && (
                        <li className="text-primary-600">+{dayPlan.dinner.ingredients.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !weekPlan && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Generate a meal plan to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
