import Login from '@/components/login'
import Profile from '@/components/profile'
import { auth } from '@/utils/auth/auth'

export default async function Home() {
  const session = await auth()
  const user = session?.user;
  console.log(user);

  const isAuthorized = user?.id
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-4">
      <h1 className="text-2xl font-semibold">
        {isAuthorized ? 'Welcome to your profile!' : 'Please sign in'}
      </h1>
      <div>{isAuthorized ? <Profile /> : <Login />}</div>
    </div>
  )
}
