'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export const signInAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  console.log('Sign-in attempt for email:', email);

  if (!email || !password) {
    console.log('Email or password missing');
    return { error: 'Email and password are required' };
  }

  const supabase = createClient();

  const { data: user, error: userError } = await supabase
    .from('Users')
    .select('Email, Password, Role')
    .eq('Email', email)
    .single();

  if (userError || !user) {
    console.error('Sign-In Query Error:', userError?.message);
    return { error: 'Invalid email or password' };
  }

  if (user.Password !== password) {
    console.error('Invalid password for email:', email);
    return { error: 'Invalid email or password' };
  }

  console.log('User authenticated successfully. Setting cookies...');

  // Set user role and email in cookies
  cookies().set('role', user.Role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  cookies().set('userEmail', user.Email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  console.log('Cookies set. User logged in:', {
    Email: user.Email,
    Role: user.Role,
  });

  return { success: true };
};
