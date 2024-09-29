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

  // Fetch the user by email
  const { data: user, error: userError } = await supabase
    .from('Users')
    .select('Email, Password, Role')
    .eq('Email', email)
    .single(); // Make sure there’s only one user returned

  if (userError || !user) {
    console.error('Sign-In Query Error:', userError?.message);
    return encodedRedirect('error', '/Error', 'Invalid email or password');
  }

  // Check if the password matches
  if (user.Password !== password) {
    console.error('Invalid password for email:', email);
    return encodedRedirect('error', '/Error', 'Invalid email or password');
  }

  console.log('User Logged In:', user); // Successfully logged in

  const userRole = user.Role;

  // Redirect based on user roles
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
