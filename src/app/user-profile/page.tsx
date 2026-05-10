import {
  UserProfile,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from '@clerk/nextjs'

export default function UserProfilePage() {
  return (
    <>
      <SignedIn>
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
          <UserProfile
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-xl rounded-2xl',
              },
            }}
          />
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
