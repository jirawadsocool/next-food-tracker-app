'use client'

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// 1. นำเข้า Supabase Client ที่เราตั้งค่าไว้
import { supabase } from '@/lib/supabase';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState<boolean>(false); 

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage({ text: error.message, type: 'error' });
      } else if (data.session) {
        setMessage({ text: 'Login successful! Redirecting...', type: 'success' });
        
        // สำคัญ: ต้องเรียก router.refresh() ก่อน push เพื่ออัปเดต Session
        router.refresh(); 
        router.push('/dashboard');
      } else {
        // กรณีที่ไม่เกิด error แต่ไม่ได้รับ session
        setMessage({ text: 'Login failed. Please check your credentials.', type: 'error' });
      }
    } catch (err) {
      console.error('Login error:', err);
      setMessage({ text: 'An unexpected network error occurred.', type: 'error' });
    } finally {
      // 5. หยุดสถานะ Loading ไม่ว่าจะเกิดอะไรขึ้น
      setLoading(false);
    }
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
              disabled={loading} // ปิดการใช้งานระหว่างรอ
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
              disabled={loading} // ปิดการใช้งานระหว่างรอ
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading} // ปิดการใช้งานเมื่อกำลังโหลด
            className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 disabled:bg-purple-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don&apos;t have an account yet?{' '}
          <Link href="/register" className="font-bold text-purple-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
