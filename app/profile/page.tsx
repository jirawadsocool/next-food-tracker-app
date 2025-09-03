'use client'

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';

// This is a mock user data for demonstration purposes.
// In a real application, you would fetch this from your database.
const MOCK_USER_DATA = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  gender: 'Male',
  profileImageUrl: 'https://placehold.co/150x150/F4D03F/2563EB?text=Profile',
};

const ProfilePage: React.FC = () => {
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [gender, setGender] = useState<string>('Male');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    // Load mock user data when the component mounts
    setFullName(MOCK_USER_DATA.fullName);
    setEmail(MOCK_USER_DATA.email);
    setGender(MOCK_USER_DATA.gender);
    setImagePreviewUrl(MOCK_USER_DATA.profileImageUrl);
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
    if (!fullName || !email) {
      setMessage({ text: 'Please fill in all required fields.', type: 'error' });
      return;
    }
    // Logic to save the user data (e.g., to a database)
    console.log({
      fullName,
      email,
      password,
      gender,
      imageFile
    });
    setMessage({ text: 'Profile updated successfully!', type: 'success' });
    // Hide message after a few seconds
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <title>Profile | Food Tracker</title>

      <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-300 hover:scale-[1.01]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-800">Edit Profile</h2>
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
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <img src={imagePreviewUrl || 'https://placehold.co/150x150/F4D03F/2563EB?text=Profile'} alt="Profile Preview" className="w-32 h-32 object-cover rounded-full shadow-md" />
            </div>
            <label htmlFor="profileImage" className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-full shadow-md cursor-pointer transition-colors duration-200 hover:bg-gray-300">
              Change Image
            </label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-gray-700 font-semibold mb-2">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Password (for update) */}
          <div>
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-gray-700 font-semibold mb-2">Gender</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
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

export default ProfilePage;
