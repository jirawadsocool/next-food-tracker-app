'use client'

import { useState, useMemo, ChangeEvent } from 'react';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/auth-helpers-nextjs';

// Mock Data for demonstration
const MOCK_FOOD_DATA = [
  { id: 1, date: '2024-05-20', image: 'https://placehold.co/100x100/A0E7E5/2563EB?text=Pizza', name: 'Pizza', meal: 'Dinner' },
  { id: 2, date: '2024-05-20', image: 'https://placehold.co/100x100/F4D03F/2563EB?text=Salad', name: 'Salad', meal: 'Lunch' },
  { id: 3, date: '2024-05-19', image: 'https://placehold.co/100x100/C39BD3/2563EB?text=Pasta', name: 'Pasta', meal: 'Dinner' },
  { id: 4, date: '2024-05-19', image: 'https://placehold.co/100x100/85C1E9/2563EB?text=Steak', name: 'Steak', meal: 'Dinner' },
  { id: 5, date: '2024-05-18', image: 'https://placehold.co/100x100/76D7C4/2563EB?text=Burger', name: 'Burger', meal: 'Lunch' },
  { id: 6, date: '2024-05-18', image: 'https://placehold.co/100x100/D4EFDF/2563EB?text=Sushi', name: 'Sushi', meal: 'Dinner' },
  { id: 7, date: '2024-05-17', image: 'https://placehold.co/100x100/F1948A/2563EB?text=Soup', name: 'Soup', meal: 'Lunch' },
  { id: 8, date: '2024-05-17', image: 'https://placehold.co/100x100/A569BD/2563EB?text=Tacos', name: 'Tacos', meal: 'Dinner' },
  { id: 9, date: '2024-05-16', image: 'https://placehold.co/100x100/5DADE2/2563EB?text=Noodles', name: 'Noodles', meal: 'Dinner' },
  { id: 10, date: '2024-05-16', image: 'https://placehold.co/100x100/E59866/2563EB?text=Rice', name: 'Rice', meal: 'Lunch' },
  { id: 11, date: '2024-05-15', image: 'https://placehold.co/100x100/A9CCE3/2563EB?text=Chicken', name: 'Chicken', meal: 'Dinner' },
  { id: 12, date: '2024-05-15', image: 'https://placehold.co/100x100/D98880/2563EB?text=Fish', name: 'Fish', meal: 'Lunch' },
  { id: 13, date: '2024-05-14', image: 'https://placehold.co/100x100/7FB3D5/2563EB?text=Curry', name: 'Curry', meal: 'Dinner' },
  { id: 14, date: '2024-05-14', image: 'https://placehold.co/100x100/F0B27A/2563EB?text=Stew', name: 'Stew', meal: 'Dinner' },
  { id: 15, date: '2024-05-13', image: 'https://placehold.co/100x100/80C263/2563EB?text=Soup', name: 'Soup', meal: 'Lunch' },
];

const ITEMS_PER_PAGE = 5;

export const createClient = () => {
  const cookieStore = cookies();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables in server utility. Check .env.local.');
  }

  return createServerClient<any>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          cookieStore.set({ name, value, ...options });
        },
        remove: (name: string, options: any) => {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
};

const DashboardPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [foods, setFoods] = useState(MOCK_FOOD_DATA);

  const filteredFoods = useMemo(() => {
    if (!searchTerm) {
      return foods;
    }
    return foods.filter(food =>
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [foods, searchTerm]);

  const totalPages = Math.ceil(filteredFoods.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentFoods = filteredFoods.slice(startIndex, endIndex);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = (id: number) => {
    // Note: window.confirm() and alert() are not supported in this environment.
    // A confirmation message would typically be handled with a custom modal in a real app.
    setFoods(foods.filter(food => food.id !== id));
    // Re-evaluate current page in case the last item on a page was deleted
    const newTotalPages = Math.ceil((foods.length - 1) / ITEMS_PER_PAGE);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  const handleEdit = (id: number) => {
    console.log(`Editing food item with ID: ${id}`);
    // You can navigate to an edit page or open a modal here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 sm:p-6 lg:p-12">
      <title>Dashboard | Food Tracker</title>

      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4 sm:mb-0">Dashboard</h1>
          <a href="/addfood" className="bg-green-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50">
            Add Food
          </a>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            placeholder="Search food by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full sm:w-80 p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full bg-white border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-4 px-4 text-left font-semibold text-gray-700">Date</th>
                <th className="py-4 px-4 text-left font-semibold text-gray-700 hidden md:table-cell">Image</th>
                <th className="py-4 px-4 text-left font-semibold text-gray-700">Food Name</th>
                <th className="py-4 px-4 text-left font-semibold text-gray-700 hidden sm:table-cell">Meal</th>
                <th className="py-4 px-4 text-center font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentFoods.length > 0 ? (
                currentFoods.map((food) => (
                  <tr key={food.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                    <td className="py-4 px-4 text-gray-800">{food.date}</td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <img
                        src={food.image}
                        alt={food.name}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                    </td>
                    <td className="py-4 px-4 text-gray-800 font-medium">{food.name}</td>
                    <td className="py-4 px-4 text-gray-600 hidden sm:table-cell">{food.meal}</td>
                    <td className="py-4 px-4 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(food.id)}
                        className="bg-blue-500 text-white p-2 rounded-full shadow-md transform transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828zM4 11V7h4l-4 4zm-1 3v-2.586l6-6L14.586 9l-6 6H3v-2z" /></svg>
                      </button>
                      <button
                        onClick={() => handleDelete(food.id)}
                        className="bg-red-500 text-white p-2 rounded-full shadow-md transform transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1z" clipRule="evenodd" /></svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">No food items found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredFoods.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full transition-colors duration-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-700 font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full transition-colors duration-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;