// Task P2-T-018: Create Authentication Pages
import SigninForm from '@/components/SigninForm'
import Layout from '@/components/Layout'

export default function SigninPage() {
  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center">
        <SigninForm />
      </div>
    </Layout>
  )
}
