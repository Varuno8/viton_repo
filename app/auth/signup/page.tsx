import { AuthForm } from '@/components/AuthForm'

export default function SignUpPage() {
  return (
    <div>
      <h1 className="text-xl mb-4">Sign Up</h1>
      <AuthForm mode="signup" />
    </div>
  )
}
