'use client'

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';

// This is a mock food data for demonstration purposes.
// In a real application, you would get the food item ID from the URL
// and fetch its data from your database.
const MOCK_FOOD_DATA = {
  id: 1,
  foodName: 'Spaghetti Bolognese',
  meal: 'Dinner',
  date: '2024-05-20',
  imageUrl: 'https://placehold.co/150x150/A0E7E5/2563EB?text=Spaghetti',
};

const EditFoodPage: React.FC = () => {
  const [foodName, setFoodName] = useState<string>('');
  const [meal, setMeal] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    // Load mock food data when the component mounts
    setFoodName(MOCK_FOOD_DATA.foodName);
    setMeal(MOCK_FOOD_DATA.meal);
    setDate(MOCK_FOOD_DATA.date);
    setImagePreviewUrl(MOCK_FOOD_DATA.imageUrl);
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreviewUrl(null);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!foodName || !date) {
      setMessage({ text: 'Please fill in all required fields.', type: 'error' });
      return;
    }
    // Logic to save the updated food data (e.g., to a database)
    console.log({
      foodId: MOCK_FOOD_DATA.id,
      foodName,
      meal,
      date,
      imageFile
    });
    setMessage({ text: 'Food updated successfully!', type: 'success' });
    // Hide message after a few seconds
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <title>Edit Food | Food Tracker</title>

      <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-300 hover:scale-[1.01]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-800">Edit Food</h2>
          <a href="/dashboard" className="text-sm font-semibold text-gray-600 hover:text-blue-500 transition-colors duration-200">
            &larr; Back to Dashboard
          </a>
        </div>

        {message && (
          <div className={`p-4 mb-6 rounded-lg text-center font-semibold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Food Image */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <img src={imagePreviewUrl || 'https://placehold.co/150x150/E5E7EB/2563EB?text=Food'} alt="Food Preview" className="w-32 h-32 object-cover rounded-xl shadow-md" />
            </div>
            <label htmlFor="foodImage" className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-full shadow-md cursor-pointer transition-colors duration-200 hover:bg-gray-300">
              Change Image
            </label>
            <input
              type="file"
              id="foodImage"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Food Name */}
          <div>
            <label htmlFor="foodName" className="block text-gray-700 font-semibold mb-2">Food Name</label>
            <input
              type="text"
              id="foodName"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Meal */}
          <div>
            <label htmlFor="meal" className="block text-gray-700 font-semibold mb-2">Meal</label>
            <select
              id="meal"
              value={meal}
              onChange={(e) => setMeal(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-gray-700 font-semibold mb-2">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditFoodPage;