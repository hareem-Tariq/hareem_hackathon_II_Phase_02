// Task Detail Client Component
// Fixed for Next.js 16: Separated client logic from server component
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute, { getCurrentUserId } from '@/components/ProtectedRoute'
import Layout from '@/components/Layout'
import { Task, TaskUpdate } from '@/types/task'
import { getTask, updateTask, deleteTask } from '@/lib/api/tasks'

interface TaskDetailClientProps {
  taskId: string
}

export default function TaskDetailClient({ taskId }: TaskDetailClientProps) {
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const userId = getCurrentUserId()

  useEffect(() => {
    if (!userId || !taskId) return

    const fetchTask = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await getTask(userId, taskId)
        setTask(data)
        setTitle(data.title)
        setDescription(data.description || '')
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Task not found')
        } else {
          // Fix: Safely extract error message from detail object or string
          const errorDetail = err.response?.data?.detail
          if (typeof errorDetail === 'string') {
            setError(errorDetail)
          } else if (errorDetail && typeof errorDetail === 'object') {
            // Handle validation error objects
            setError(JSON.stringify(errorDetail))
          } else {
            setError('Failed to load task')
          }
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTask()
  }, [userId, taskId])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !task) return

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const updateData: TaskUpdate = {
        title: title.trim(),
        description: description.trim() || undefined,
      }

      const updated = await updateTask(userId, task.id, updateData)
      setTask(updated)
      setEditMode(false)
      setSuccess('Task updated successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      // Fix: Safely extract error message
      const errorDetail = err.response?.data?.detail
      if (typeof errorDetail === 'string') {
        setError(errorDetail)
      } else if (errorDetail && typeof errorDetail === 'object') {
        setError(JSON.stringify(errorDetail))
      } else {
        setError('Failed to update task')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!userId || !task) return
    
    if (!confirm('Are you sure you want to delete this task?')) {
      return
    }

    try {
      await deleteTask(userId, task.id)
      router.push('/tasks')
    } catch (err: any) {
      // Fix: Safely extract error message
      const errorDetail = err.response?.data?.detail
      if (typeof errorDetail === 'string') {
        setError(errorDetail)
      } else if (errorDetail && typeof errorDetail === 'object') {
        setError(JSON.stringify(errorDetail))
      } else {
        setError('Failed to delete task')
      }
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="max-w-2xl mx-auto text-center py-12">
            <p className="text-gray-500 text-lg">Loading task...</p>
          </div>
        </Layout>
      </ProtectedRoute>
    )
  }

  if (error && !task) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="max-w-3xl mx-auto">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
            <button
              onClick={() => router.push('/tasks')}
              className="flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Tasks
            </button>
          </div>
        </Layout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.push('/tasks')}
            className="mb-6 flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Tasks
          </button>

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {task && (
            <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200">
              {editMode ? (
                <form onSubmit={handleUpdate}>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Edit Task</h2>
                  </div>
                  
                  <div className="space-y-4 mb-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                      </label>
                      <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={200}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        maxLength={1000}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false)
                        setTitle(task.title)
                        setDescription(task.description || '')
                      }}
                      className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-4xl font-bold text-gray-900">{task.title}</h2>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                      task.completed 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}>
                      {task.completed ? '✓ Completed' : '○ Pending'}
                    </span>
                  </div>

                  {task.description && (
                    <div className="bg-gray-50 p-6 rounded-xl mb-6 border border-gray-200">
                      <p className="text-gray-800 text-lg whitespace-pre-wrap leading-relaxed">{task.description}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Created: {new Date(task.created_at).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Updated: {new Date(task.updated_at).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditMode(true)}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Task
                    </button>
                    <button
                      onClick={handleDelete}
                      className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Task
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
