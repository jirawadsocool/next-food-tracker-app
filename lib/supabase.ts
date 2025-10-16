import { createClient } from '@supabase/supabase-js'

// ดึงค่าจาก .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  // ข้อความ Error จะปรากฏใน Terminal ถ้าไม่ได้ตั้งค่า .env.local
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// สร้าง Client Instance สำหรับการเรียกใช้ API
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
