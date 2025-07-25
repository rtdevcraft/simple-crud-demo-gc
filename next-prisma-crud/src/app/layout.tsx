import type { Metadata } from 'next'
import AppThemeRegistry from './ThemeRegistry'
import AppSessionProvider from './SessionProvider'

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'A Next.js, Prisma, and MUI CRUD Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>
        <AppSessionProvider>
          <AppThemeRegistry>{children}</AppThemeRegistry>
        </AppSessionProvider>
      </body>
    </html>
  )
}
