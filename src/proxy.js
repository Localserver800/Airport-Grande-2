import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function proxy(req) {
  const res = NextResponse.next();
  
  // Only protect /admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Skip protection for the login page itself to avoid infinite redirect
    if (req.nextUrl.pathname === '/admin/login') {
      return res;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get session from cookies
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    // Check for admin email (should be in env)
    const adminEmail = process.env.ADMIN_EMAIL || 'airportgrande@gmail.com';
    if (session.user.email !== adminEmail) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};
