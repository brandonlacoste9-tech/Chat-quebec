export { auth as proxy } from '@/app/api/auth/[...nextauth]/route'

export const config = {
  matcher: ['/((?!login|check-email|api/auth|_next|favicon).*)']
}
