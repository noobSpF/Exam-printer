import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(req: any) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = req.nextUrl.clone();

  // Redirect to /sign-in if the user is not authenticated and trying to access a protected route
  if (!session && url.pathname !== '/sign-in') {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // If the user is authenticated, fetch the user's role
  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  const { data: userRoleData, error: roleError } = await supabase
    .from('User')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (roleError || !userRoleData) {
    return NextResponse.redirect(new URL('/error', req.url));
  }

  const userRole = userRoleData.role;

  // Redirect based on user roles
  if (url.pathname.startsWith('/protected/admin') && userRole !== 'Admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }
  if (
    url.pathname.startsWith('/protected/instructor') &&
    userRole !== 'Instructor'
  ) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }
  if (
    url.pathname.startsWith('/protected/exam-officer') &&
    userRole !== 'ExamOfficer'
  ) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }
  if (url.pathname.startsWith('/protected/tech') && userRole !== 'TechUnit') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

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
