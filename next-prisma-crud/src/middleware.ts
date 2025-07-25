import { authConfig } from '@/lib/auth'
import { auth } from 'next-auth'

const protectedRoutes = ['/dashboard', '/api/tasks']

export default auth((req) => {
  const isProtected = protectedRoutes.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  )

  if (!req.auth && isProtected) {
    const loginUrl = new URL('/api/auth/signin', req.url)
    return Response.redirect(loginUrl)
  }

  return null
}, authConfig)

export const config = {
  matcher: ['/dashboard/:path*', '/api/tasks/:path*'],
}
