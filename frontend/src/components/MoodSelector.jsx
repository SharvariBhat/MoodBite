import React from 'react';

const MOODS = ['happy', 'cozy', 'energetic', 'calm', 'adventurous', 'healthy'];
const DIETS = ['both', 'veg', 'non-veg', 'vegan', 'keto', 'pescatarian'];
const TIMES = ['under_10', 'under_20', 'under_30', 'any'];
const DIFFICULTIES = ['beginner', 'medium', 'hard', 'any'];
const CUISINES = ['italian', 'asian', 'mexican', 'indian', 'mediterranean', 'any'];

export default function MoodSelector({ onGenerate, loading }) {
  const [mood, setMood] = React.useState('happy');
  const [diet, setDiet] = React.useState('both');
  const [time, setTime] = React.useState('any');
  const [difficulty, setDifficulty] = React.useState('any');
  const [cuisine, setCuisine] = React.useState('any');

  const handleSurpriseMe = () => {
    const randomMood = MOODS[Math.floor(Math.random() * MOODS.length)];
    const randomDiet = DIETS[Math.floor(Math.random() * DIETS.length)];
    const randomTime = TIMES[Math.floor(Math.random() * TIMES.length)];
    const randomDifficulty = DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)];
    const randomCuisine = CUISINES[Math.floor(Math.random() * CUISINES.length)];

    setMood(randomMood);
    setDiet(randomDiet);
    setTime(randomTime);
    setDifficulty(randomDifficulty);
    setCuisine(randomCuisine);

    setTimeout(() => {
      onGenerate(randomMood, randomDiet, randomTime, randomDifficulty, randomCuisine);
    }, 100);
  };

  const handleGenerate = () => {
    onGenerate(mood, diet, time, difficulty, cuisine);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">What's your mood?</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Mood</label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Select mood"
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Select cooking time"
          >
            {TIMES.map((t) => (
              <option key={t} value={t}>
                {t === 'any' ? 'Any' : t.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Select difficulty level"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Cuisine</label>
          <select
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Select cuisine type"
          >
            {CUISINES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex-1 bg-gradient-warm text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
          aria-label="Generate recipes"
        >
          {loading ? 'Generating...' : '✨ Generate Recipes'}
        </button>
        <button
          onClick={handleSurpriseMe}
          disabled={loading}
          className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
          aria-label="Surprise me with random selections"
        >
          🎲 Surprise Me
        </button>
      </div>
    </div>
  );
}
