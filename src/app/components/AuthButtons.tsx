import { signIn, signOut } from '../../../auth'
import { Button } from '@mui/material'

export function SignIn() {
  return (
    <form
      action={async () => {
        'use server'
        await signIn('google')
      }}
    >
      <Button type='submit' variant='contained'>
        Sign in with Google
      </Button>
    </form>
  )
}

export function SignOut() {
  return (
    <form
      action={async () => {
        'use server'
        await signOut()
      }}
    >
      <Button type='submit' variant='outlined'>
        Sign Out
      </Button>
    </form>
  )
}
