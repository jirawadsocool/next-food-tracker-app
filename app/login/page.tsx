'use client'

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push('/dashboard')
    
    // Logic for handling form submission goes here
    console.log({ email, password });
    setMessage({ text: 'Login successful!', type: 'success' });
    // Simulate API call or form submission
    setTimeout(() => {
        setMessage(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      
      <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-2xl w-full max-w-sm transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Login
        </h2>
        {message && (
          <div className={`p-4 mb-4 rounded-lg text-center font-semibold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account yet?{' '}
          <Link href="/register" className="font-bold text-purple-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
