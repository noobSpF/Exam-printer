import { NextRequest, NextResponse } from 'next/server';

const MAX_REDIRECTS = 5;

const rolePaths = {
  Admin: ['/admin/dashBoard', '/admin/addUser', '/admin/editUser'],
  Instructor: [
    '/instructor/dashBoard',
    '/instructor/profile',
    '/instructor/addExam',
  ],
  ExamOfficer: [
    '/exam-officer/dashBoard',
    '/exam-officer/profile',
    '/exam-officer/addSubject',
    '/exam-officer/backupExam',
  ],
  TechUnit: [
    '/tech/dashBoard',
    '/tech/profile',
    '/tech/reviewExam',
    '/tech/printExam',
    '/tech/viewExam',
    '/tech/viewBackupExam',
  ],
};

export async function middleware(request: NextRequest) {
  console.log('-------- Middleware Start --------');
  console.log('Request path:', request.nextUrl.pathname);

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
  const userId = request.cookies.get('userId')?.value;

  console.log('User email:', userEmail);
  console.log('User role:', userRole);
  console.log('User ID:', userId);

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

  const allowedPaths = rolePaths[userRole as keyof typeof rolePaths];
  console.log('Allowed paths for role:', allowedPaths);

  if (allowedPaths) {
    // Check if the current path starts with any of the allowed paths
    const isAllowedPath = allowedPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    );
    console.log('Is allowed path:', isAllowedPath);

    if (!isAllowedPath) {
      console.log('User tried to access a restricted path');

      // Special case for Admin trying to access editUser page
      if (
        userRole === 'Admin' &&
        request.nextUrl.pathname.startsWith('/admin/editUser/')
      ) {
        console.log('Admin accessing editUser page');
        const redirectUrl = new URL(`/admin/editUser/${userId}`, request.url);
        console.log('Redirecting to:', redirectUrl.toString());
        const newResponse = NextResponse.redirect(redirectUrl);
        newResponse.headers.set(
          'x-redirect-count',
          (redirectCount + 1).toString()
        );
        return newResponse;
      }

      console.log('Redirecting to default role path');
      const defaultRedirectUrl = new URL(allowedPaths[0], request.url);
      console.log('Default redirect URL:', defaultRedirectUrl.toString());
      const newResponse = NextResponse.redirect(defaultRedirectUrl);
      newResponse.headers.set(
        'x-redirect-count',
        (redirectCount + 1).toString()
      );
      return newResponse;
    }
  } else {
    console.log('User role not recognized, redirecting to default path');
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

  console.log('No redirect needed, proceeding to requested page');
  console.log('-------- Middleware End --------');
  return NextResponse.next();
}

function getRoleBasedRedirect(
  role: string | undefined,
  baseUrl: string
): URL | null {
  console.log('Getting role-based redirect for role:', role);
  let redirectUrl: URL | null = null;
  switch (role) {
    case 'Admin':
      redirectUrl = new URL('/admin/dashBoard', baseUrl);
      break;
    case 'Instructor':
      redirectUrl = new URL('/instructor/dashBoard', baseUrl);
      break;
    case 'ExamOfficer':
      redirectUrl = new URL('/exam-officer/dashBoard', baseUrl);
      break;
    case 'TechUnit':
      redirectUrl = new URL('/tech/dashBoard', baseUrl);
      break;
    default:
      redirectUrl = null;
  }
  console.log('Redirect URL:', redirectUrl?.toString() || 'null');
  return redirectUrl;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets).*)'],
};
