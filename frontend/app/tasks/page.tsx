// Task P2-T-022: Build Task List Page
'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute, { getCurrentUserId } from '@/components/ProtectedRoute'
import Layout from '@/components/Layout'
import TaskList from '@/components/TaskList'
import TaskForm from '@/components/TaskForm'
import { Task } from '@/types/task'
import { getTasks } from '@/lib/api/tasks'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const userId = getCurrentUserId()

  const fetchTasks = async () => {
    if (!userId) return

    setLoading(true)
    setError('')

    try {
      const data = await getTasks(userId)
      setTasks(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [userId])

  const handleTaskCreated = () => {
    setShowForm(false)
    fetchTasks()
  }

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  const activeCount = tasks.filter(t => !t.completed).length
  const completedCount = tasks.filter(t => t.completed).length

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 mb-3">My Tasks</h1>
            <p className="text-gray-600 text-lg">Manage your tasks and stay organized</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-500">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </div>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
          >
            {showForm ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Task
              </>
            )}
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
              filter === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-blue-300'
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
              filter === 'active'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-blue-300'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
              filter === 'completed'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-blue-300'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {showForm && userId && (
          <div className="mb-6">
            <TaskForm
              userId={userId}
              onSuccess={handleTaskCreated}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading tasks...</p>
          </div>
        ) : (
          <TaskList tasks={filteredTasks} onUpdate={fetchTasks} />
        )}
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
