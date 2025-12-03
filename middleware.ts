import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const country = request.geo?.country || 'US'
  
  // Define your country-to-path mappings
  const countryRedirects: { [key: string]: string } = {
    'DK': '/dk',
    'NO': '/no',
    'ES': '/es',
  }
  
  // Only redirect on the homepage
  if (request.nextUrl.pathname === '/') {
    const redirectPath = countryRedirects[country]
    
    if (redirectPath) {
      const url = request.nextUrl.clone()
      url.pathname = redirectPath
      return NextResponse.redirect(url)
    }
  }
  
  return NextResponse.next()
}