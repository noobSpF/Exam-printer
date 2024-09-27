'use server';

import { encodedRedirect } from '@/utils/utils';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const signInAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const supabase = createClient();

  // ตรวจสอบ Email และ Password ในตาราง Users
  const { data: user, error } = await supabase
    .from('Users')
    .select('Email, Password, Role')
    .eq('Email', email)
    .eq('Password', password) // ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
    .single(); // ดึงข้อมูลเพียง 1 แถว

  if (error) {
    // เพิ่ม console log เพื่อตรวจสอบข้อผิดพลาด
    console.error('Sign-In Query Error:', error.message);
    return encodedRedirect('error', '/Error', 'Invalid login credentials');
  }

  if (!user) {
    console.error('User Not Found');
    return encodedRedirect('error', '/Error', 'Invalid login credentials');
  }

  console.log('User Logged In:', user); // ตรวจสอบว่าผู้ใช้ลงชื่อเข้าใช้สำเร็จหรือไม่

  const userRole = user.Role;

  // เปลี่ยนเส้นทางตาม Role ของผู้ใช้
  if (userRole === 'Admin') {
    return redirect('/protected/admin/dashboard');
  } else if (userRole === 'Instructor') {
    return redirect('/protected/instructor/dashboard');
  } else if (userRole === 'ExamOfficer') {
    return redirect('/protected/exam-officer/dashboard');
  } else if (userRole === 'TechUnit') {
    return redirect('/protected/tech/dashboard');
  } else {
    return encodedRedirect('error', '/Error', 'Invalid role');
  }
};
