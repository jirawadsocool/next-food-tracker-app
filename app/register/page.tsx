'use client'

import { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Logic for handling form submission goes here
    console.log({ firstName, lastName, email, password, gender, profileImage });
    setMessage({ text: 'Form submitted successfully!', type: 'success' });
    // Simulate API call or form submission
    setTimeout(() => {
        setMessage(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      
      <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Create an Account
        </h2>
        {message && (
          <div className={`p-4 mb-4 rounded-lg text-center font-semibold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First and Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
          
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Gender</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  onChange={(e) => setGender(e.target.value)}
                  className="form-radio text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-600">Male</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  onChange={(e) => setGender(e.target.value)}
                  className="form-radio text-pink-500 focus:ring-pink-500"
                />
                <span className="text-gray-600">Female</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  onChange={(e) => setGender(e.target.value)}
                  className="form-radio text-purple-500 focus:ring-purple-500"
                />
                <span className="text-gray-600">Other</span>
              </label>
            </div>
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Profile Picture</label>
            <div className="flex flex-col items-center space-y-4">
              <label 
                htmlFor="profileImage"
                className="cursor-pointer bg-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Select Image
              </label>
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {profileImage && (
                <div className="mt-4">
                  <Image
                    src={profileImage}
                    alt="Image Preview"
                    width={150}
                    height={150}
                    className="rounded-full border-4 border-white shadow-md object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
