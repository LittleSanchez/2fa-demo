'use client'

import { useRouter } from 'next/navigation'
import Button from './button'

export default function Login() {
  const router = useRouter()
  return (
    <div>
      <Button onClick={() => router.push('/auth/login')}>Signin</Button>
      {/* <form
        action={async () => {
          'use server'
          await signIn('discord')
        }}
      >
        <Button type="submit">Signin with Discord</Button>
      </form> */}
    </div>
  )
}
