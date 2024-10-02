import { NextRequest, NextResponse } from 'next/server';

const MAX_REDIRECTS = 5;
const rolePaths = {
  Admin: ['/admin/dashBoard', '/admin/addUser', '/admin/editUser/[id]'],
  Instructor: ['/instructor/dashBoard'],
  ExamOfficer: [
    '/exam-officer/dashBoard',
    '/exam-officer/profile',
    '/exam-officer/addSubject',
    '/exam-officer/backupExam',
  ],
  TechUnit: ['/tech/dashBoard'],
};

export async function middleware(request: NextRequest) {
  console.log('Middleware called for path:', request.nextUrl.pathname);

  const redirectCount = parseInt(
    request.headers.get('x-redirect-count') || '0'
  );
  console.log('Current redirect count:', redirectCount);

  if (redirectCount >= MAX_REDIRECTS) {
    console.log('Max redirects reached, going to error page');
    return NextResponse.redirect(new URL('/error', request.url));
  }

  const userEmail = request.cookies.get('userEmail')?.value;
  const userRole = request.cookies.get('role')?.value;
  console.log('User email:', userEmail, 'User role:', userRole);

  // ไม่ต้องเช็คการ redirect สำหรับหน้า sign-in และ error
  if (
    request.nextUrl.pathname === '/sign-in' ||
    request.nextUrl.pathname === '/error'
  ) {
    console.log('On sign-in or error page, no redirect');
    return NextResponse.next();
  }

  if (!userEmail) {
    console.log('No user email, redirecting to sign-in');
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/protected')) {
    const redirectUrl = getRoleBasedRedirect(userRole, request.url);
    if (redirectUrl) {
      console.log('Redirecting to role-based URL:', redirectUrl.toString());
      const newResponse = NextResponse.redirect(redirectUrl);
      newResponse.headers.set(
        'x-redirect-count',
        (redirectCount + 1).toString()
      );
      return newResponse;
    }
  }

  // Check if the current path is valid for the user's role
  const allowedPaths = rolePaths[userRole as keyof typeof rolePaths];
  if (allowedPaths && !allowedPaths.includes(request.nextUrl.pathname)) {
    console.log(
      `User role ${userRole} tried to access a restricted path, redirecting to default role path`
    );
    const defaultRedirectUrl = new URL(allowedPaths[0], request.url);
    const newResponse = NextResponse.redirect(defaultRedirectUrl);
    newResponse.headers.set('x-redirect-count', (redirectCount + 1).toString());
    return newResponse;
  }

  console.log('No redirect needed, proceeding to requested page');
  return NextResponse.next();
}

function getRoleBasedRedirect(
  role: string | undefined,
  baseUrl: string
): URL | null {
  switch (role) {
    case 'Admin':
      return new URL('/admin/dashBoard', baseUrl);
    case 'Instructor':
      return new URL('/instructor/dashBoard', baseUrl);
    case 'ExamOfficer':
      return new URL('/exam-officer/dashBoard', baseUrl);
    case 'TechUnit':
      return new URL('/tech/dashBoard', baseUrl);
    default:
      return null;
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets).*)'],
};
