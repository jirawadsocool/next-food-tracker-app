'use client'

import { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// นำเข้า Supabase Client ที่เราตั้งค่าไว้
import { supabase } from '@/lib/supabase';
// เราจำเป็นต้องใช้ 'crypto' เพื่อสร้างชื่อไฟล์ที่ไม่ซ้ำกัน
import * as crypto from 'crypto'; 

const RegisterPage: React.FC = () => {
  // 1. กำหนด State สำหรับข้อมูลฟอร์มและสถานะ
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null); // เก็บ Object ของ File
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null); // เก็บ URL สำหรับ Preview
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  // 2. จัดการการเลือกไฟล์รูปภาพ
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file); // เก็บ File Object ไว้สำหรับอัปโหลด
      
      // สร้าง Preview URL เพื่อแสดงใน UI
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 3. ฟังก์ชันสำหรับอัปโหลดรูปโปรไฟล์ไปที่ Supabase Storage
  // เราจะเรียกใช้ฟังก์ชันนี้หลังจากผู้ใช้ลงทะเบียนสำเร็จ
  const handleProfileUpload = async (userId: string) => {
    if (!profileImageFile) return null;

    const fileExt = profileImageFile.name.split('.').pop();
    // ใช้ UUID และ timestamp ผสมกันเพื่อให้ชื่อไฟล์ไม่ซ้ำ (ต้องใช้ crypto)
    const fileName = `${userId}_${crypto.randomUUID()}.${fileExt}`; 
    const filePath = `${userId}/${fileName}`;

    // อัปโหลดไปยัง 'avatars' bucket (สมมติว่าสร้างไว้แล้วใน Supabase Storage)
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, profileImageFile, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Storage upload error: ${uploadError.message}`);
    }

    return filePath; // คืนค่า Path ของรูปที่อัปโหลด
  };

  // 4. จัดการการลงทะเบียนหลัก
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      // ลงทะเบียนผู้ใช้ด้วยอีเมลและรหัสผ่าน
      // เราสามารถแนบข้อมูล metadata เพิ่มเติม (first_name, last_name, gender) ไปพร้อมกันได้
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            gender: gender,
            // profile_path จะถูกเพิ่ม/อัปเดตหลังจากอัปโหลดรูปเสร็จ
          },
        },
      });

      if (error) {
        throw new Error(error.message); // โยน Error เพื่อเข้าสู่ catch
      }

      if (data.user) {
        let profilePath = null;
        
        // 5. ถ้ามีไฟล์รูปภาพ ให้ทำการอัปโหลด
        if (profileImageFile) {
          profilePath = await handleProfileUpload(data.user.id);
        }

        // 6. *ถ้าเรามีตาราง 'profiles' แยกต่างหาก* // ควรเพิ่มโค้ด insert หรือ update ตาราง profiles ที่นี่
        // เพื่อเก็บชื่อ, เพศ, และ path รูปโปรไฟล์อย่างถาวร

        setMessage({ 
          text: 'Registration successful! Please check your email for a confirmation link. You will be logged in after confirmation.', 
          type: 'success' 
        });
        
        // ล้างฟอร์ม
        setFirstName(''); setEmail(''); setPassword(''); setProfileImageFile(null); setProfileImagePreview(null);
        
        // ส่งผู้ใช้ไปหน้า Login หรือรอการยืนยันอีเมล
        router.push('/login');

      } else {
        setMessage({ text: 'Registration incomplete. Check email confirmation settings.', type: 'error' });
      }

    } catch (err) {
      // จัดการ Error ที่มาจาก Auth หรือ Storage
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred during registration.';
      setMessage({ text: errorMessage, type: 'error' });
      console.error(err);
    } finally {
      setLoading(false);
    }
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
                disabled={loading}
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
                disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                />
                <span className="text-gray-600">Other</span>
              </label>
            </div>
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Profile Picture (Optional)</label>
            <div className="flex flex-col items-center space-y-4">
              <label 
                htmlFor="profileImage"
                className="cursor-pointer bg-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
              >
                {profileImageFile ? 'Change Image' : 'Select Image'}
              </label>
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={loading}
              />
              {profileImagePreview && (
                <div className="mt-4">
                  <Image
                    src={profileImagePreview}
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
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register'}
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
