import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(req: any) {
  // const supabase = createClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  // );

  // // Fetch the session
  // const {
  //   data: { session },
  //   error: sessionError,
  // } = await supabase.auth.getSession();

  // const url = req.nextUrl.clone();

  // // If no session is found and the user is not on the sign-in page, redirect to sign-in
  // if (!session && url.pathname !== '/sign-in') {
  //   console.log('No session found, redirecting to /sign-in');
  //   return NextResponse.redirect(new URL('/sign-in', req.url));
  // }

  // // If the user is authenticated, fetch their role from the Users table
  // if (session) {
  //   const { data: userRoleData, error: roleError } = await supabase
  //     .from('Users') // Make sure your table is correctly named "Users"
  //     .select('Role') // Use 'Role' if that’s the exact column name
  //     .eq('UserKey', session.user.id) // Ensure this matches your primary key in the table
  //     .single(); // Fetch a single row

  //   // If there’s an error fetching the role or no user found, redirect to error
  //   if (roleError || !userRoleData) {
  //     console.error('Role Fetch Error:', roleError?.message || 'No user found');
  //     return NextResponse.redirect(new URL('/error', req.url));
  //   }

  //   const userRole = userRoleData.Role;
  //   console.log('User role:', userRole);

  //   // Redirect users based on their role
  //   if (url.pathname.startsWith('/protected/admin') && userRole !== 'Admin') {
  //     return NextResponse.redirect(new URL('/unauthorized', req.url));
  //   }
  //   if (
  //     url.pathname.startsWith('/protected/instructor') &&
  //     userRole !== 'Instructor'
  //   ) {
  //     return NextResponse.redirect(new URL('/unauthorized', req.url));
  //   }
  //   if (
  //     url.pathname.startsWith('/protected/exam-officer') &&
  //     userRole !== 'ExamOfficer'
  //   ) {
  //     return NextResponse.redirect(new URL('/unauthorized', req.url));
  //   }
  //   if (url.pathname.startsWith('/protected/tech') && userRole !== 'TechUnit') {
  //     return NextResponse.redirect(new URL('/unauthorized', req.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/protected/:path*',
    '/admin/:path*',
    '/exam-officer/:path*',
    '/tech/:path*',
    '/instructor/:path*',
  ],
};
