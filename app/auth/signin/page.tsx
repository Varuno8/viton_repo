import { AuthForm } from '@/components/AuthForm'

export default function SignInPage() {
  return (
    <div>
      <h1 className="text-xl mb-4">Sign In</h1>
      <AuthForm mode="signin" />
    </div>
  )
}
