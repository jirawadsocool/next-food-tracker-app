'use client'

import { useState, ChangeEvent, FormEvent } from 'react';
import { supabase } from "@/lib/supabase";
import { addFood } from './action';

const AddFoodPage: React.FC = () => {
  const [foodName, setFoodName] = useState<string>('');
  const [meal, setMeal] = useState<string>('Breakfast');
  const [date, setDate] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!foodName || !date) {
      setMessage({ text: 'Please fill in all required fields.', type: 'error' });
      return;
    }
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await addFood(formData);
      if (result?.error) {
        throw new Error(result.error);
      }
      
      setMessage({ text: 'Food saved successfully!', type: 'success' });
      // Clear form after submission
      setFoodName('');
      setMeal('Breakfast');
      setDate('');
      setImageFile(null);
      setImagePreviewUrl(null);
      // Reset the file input
      if (e.currentTarget.foodImage) {
        e.currentTarget.foodImage.value = '';
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setMessage({ text: `Error: ${errorMessage}`, type: 'error' });
      console.error(error);
    } finally {
      setIsSubmitting(false);
      // Hide message after a few seconds
      setTimeout(() => {
          setMessage(null);
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <title>Add Food | Food Tracker</title>

      <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-300 hover:scale-[1.01]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-800">Add New Food</h2>
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
          {/* Food Name */}
          <div>
            <label htmlFor="foodName" className="block text-gray-700 font-semibold mb-2">Food Name</label>
            <input
              type="text"
              id="foodName"
              name="name"
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
              name="meal"
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
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Image Upload with Preview */}
          <div>
            <label htmlFor="foodImage" className="block text-gray-700 font-semibold mb-2">Food Image</label>
            <input
              type="file"
              id="foodImage"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-blue-700 hover:file:bg-violet-100 cursor-pointer"
            />
            {imagePreviewUrl && (
              <div className="mt-4 flex justify-center">
                <img src={imagePreviewUrl} alt="Image Preview" className="w-32 h-32 object-cover rounded-xl shadow-md" />
              </div>
            )}
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:scale-100"
          >
            {isSubmitting ? 'Saving...' : 'Save Food'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFoodPage;