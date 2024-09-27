'use server';

import { encodedRedirect } from '@/utils/utils';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from "next/headers";

export const signInAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  const supabase = createClient();

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }


  // ตรวจสอบ Email และ Password ในตาราง Users
  const{error} = await supabase.auth.signInWithPassword({
    email,password,
  })

  if (error) {
    // เพิ่ม console log เพื่อตรวจสอบข้อผิดพลาด
    console.error('Sign-In Query Error:', error.message);
    return encodedRedirect('error', '/Error', 'Invalid login credentials');
  }
  return redirect("/Error");

  // if (!user) {
  //   console.error('User Not Found');
  //   return encodedRedirect('error', '/Error', 'Invalid login credentials');
  // }

  // console.log('User Logged In:', user); // ตรวจสอบว่าผู้ใช้ลงชื่อเข้าใช้สำเร็จหรือไม่

  // const userRole = user.Role;

  // // เปลี่ยนเส้นทางตาม Role ของผู้ใช้
  // if (userRole === 'Admin') {
  //   return redirect('/protected/admin/dashboard');
  // } else if (userRole === 'Instructor') {
  //   return redirect('/protected/instructor/dashboard');
  // } else if (userRole === 'ExamOfficer') {
  //   return redirect('/protected/exam-officer/dashboard');
  // } else if (userRole === 'TechUnit') {
  //   return redirect('/protected/tech/dashboard');
  // } else {
  //   return encodedRedirect('error', '/Error', 'Invalid role');
  // }
};
