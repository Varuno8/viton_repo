import { NextResponse } from 'next/server'

export function middleware() {
  if (process.env.AUTH_PROVIDER === 'clerk') {
    // Placeholder: actual Clerk middleware would go here
  }
  return NextResponse.next()
}
