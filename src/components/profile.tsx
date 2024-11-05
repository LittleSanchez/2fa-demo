import { auth, signOut } from '@/utils/auth/auth'
import Button from './button'

const Profile = async () => {
  const session = await auth()
  const user = session?.user

  if (!user) {
    return null
  }

  return (
    <div>
      <div className="flex gap-4 my-2">
        {user.image && (
          <img
            className="w-32 h-32 rounded-xl"
            src={user.image}
            alt={user.name!}
          />
        )}
        <div className='space-y-2'>
          <div>
            <h1 className="text-lg font-semibold">{user.name}</h1>
            <p>{user.email}</p>
          </div>
          <form
            action={async () => {
              'use server'
              await signOut()
            }}
          >
            <Button>Sign out</Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
