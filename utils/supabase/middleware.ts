import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // This will refresh session if expired - required for Server Components
    const { data: user, error: userError } = await supabase.auth.getUser();

    // Redirect if user is not logged in
    if (request.nextUrl.pathname.startsWith("/Google") && userError) {
      console.log("User not logged in, redirecting to sign-in");
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Log user data for debugging
    console.log("User data:", user);

    const userId = user?.user?.id;

    // Fetch user role from the database
    const { data: GetuserRole, error: roleError } = await supabase
      .from('Users')
      .select('Role')
      .eq('UserKey', userId)
      .single(); // Use .single() to get the single user role directly

    if (roleError) {
      console.error("Error fetching user role:", roleError.message);
      return NextResponse.redirect(new URL('/Error', request.url));
    }

    const userRole = GetuserRole?.Role; // Directly get Role from fetched data
    console.log("User Role:", userRole);

    // Redirect based on user role
    if (userRole === 'Admin') {
      return NextResponse.redirect(new URL('/protected/admin/dashboard', request.url));
    } else if (userRole === 'Instructor') {
      return NextResponse.redirect(new URL('/protected/instructor/dashboard', request.url));
    } else if (userRole === 'ExamOfficer') {
      return NextResponse.redirect(new URL('/protected/exam-officer/dashboard', request.url));
    } else if (userRole === 'TechUnit') {
      return NextResponse.redirect(new URL('/protected/tech/dashboard', request.url));
    } else {
      console.warn("Invalid user role:", userRole);
      return NextResponse.redirect(new URL('/Error', request.url));
    }
  } catch (e) {
    console.error("An error occurred:", e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
