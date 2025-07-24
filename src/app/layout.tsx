import { auth } from '../../lib/auth'
import { SignIn, SignOut } from './components/AuthButtons'
import { Box, Typography, AppBar, Toolbar } from '@mui/material'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang='en'>
      <body>
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
              Task Manager
            </Typography>
            {session?.user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography>{session.user.name}</Typography>
                <SignOut />
              </Box>
            ) : (
              <SignIn />
            )}
          </Toolbar>
        </AppBar>
        {children}
      </body>
    </html>
  )
}
