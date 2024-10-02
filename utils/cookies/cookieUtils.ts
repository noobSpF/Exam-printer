'use server';
import { cookies } from 'next/headers';

export const getUserEmailFromCookies = () => {
  const cookieStore = cookies();
  const emailCookie = cookieStore.get('userEmail');
  return emailCookie ? emailCookie.value : null;
};
