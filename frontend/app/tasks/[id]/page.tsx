// Task P2-T-024: Build Task Detail Page
// Fixed for Next.js 16: Pure Server Component with async params
import TaskDetailClient from './TaskDetailClient'

export default async function TaskDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Next.js 16: Await params Promise in async server component
  const { id } = await params
  
  // Pass taskId to client component
  return <TaskDetailClient taskId={id} />
}
