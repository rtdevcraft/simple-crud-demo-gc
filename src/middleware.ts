import { auth } from '../auth'

export default auth((req) => {
  // `req.auth` is an object containing the user's session
  // If `req.auth` is null, the user is not signed in
  if (!req.auth) {
    // Construct the login URL
    const loginUrl = new URL('/api/auth/signin', req.url)
    // Add a callbackUrl so the user is redirected back to the page they were on
    loginUrl.searchParams.set('callbackUrl', req.url)
    // Redirect to the login page
    return Response.redirect(loginUrl)
  }
})

// Specific paths to not run on middleware
export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}
