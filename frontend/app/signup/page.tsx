// Task P2-T-018: Create Authentication Pages
import SignupForm from '@/components/SignupForm'
import Layout from '@/components/Layout'

export default function SignupPage() {
  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center">
        <SignupForm />
      </div>
    </Layout>
  )
}
