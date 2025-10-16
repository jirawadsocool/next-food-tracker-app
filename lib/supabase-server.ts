import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/auth-helpers-nextjs';

// **เพิ่ม Comment พิเศษเพื่อระบุว่านี่คือ Server-Only Module**
// Next.js จะเข้าใจว่าโค้ดนี้รันเฉพาะฝั่งเซิร์ฟเวอร์เท่านั้น
// และทำให้การใช้ cookies() ไม่มี Error ใน Editor
// @ts-ignore
// ฟังก์ชันนี้จะสร้าง Supabase Client ใหม่ทุกครั้งที่มีการเรียกใช้ (เมื่อ Request เข้ามา)
export const createClient = () => {
  const cookieStore = cookies();
  
  // 1. ดึง Environment Variables
  // เพิ่ม ! เพื่อยืนยันกับ TypeScript ว่าค่านี้มีอยู่จริง (เพราะเราเช็คไปแล้ว)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables in server utility. Check .env.local.');
  }

  // 2. สร้าง Client สำหรับ Server Component
  return createServerClient<any>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        // กำหนดวิธีการอ่าน Cookie
        get: (name: string) => cookieStore.get(name)?.value,
        // กำหนดวิธีการตั้งค่า Cookie
        set: (name: string, value: string, options: any) => {
          cookieStore.set({ name, value, ...options });
        },
        // กำหนดวิธีการลบ Cookie
        remove: (name: string, options: any) => {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
};
