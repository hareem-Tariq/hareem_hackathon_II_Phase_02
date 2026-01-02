// Task P2-T-022: Build Task List Page
'use client'

import { useState } from 'react'
import { Task } from '@/types/task'
import { deleteTask, toggleComplete } from '@/lib/api/tasks'

interface TaskItemProps {
  task: Task
  onUpdate: () => void
}

export default function TaskItem({ task, onUpdate }: TaskItemProps) {
  const [isTogglingComplete, setIsTogglingComplete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggle = async () => {
    if (isTogglingComplete) return
    
    setIsTogglingComplete(true)
    try {
      await toggleComplete(task.user_id, task.id)
      onUpdate()
    } catch (error) {
      console.error('Failed to toggle task:', error)
    } finally {
      setIsTogglingComplete(false)
    }
  }

  const handleDelete = async () => {
    if (isDeleting) return
    
    if (!confirm('Are you sure you want to delete this task?')) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteTask(task.user_id, task.id)
      onUpdate()
    } catch (error) {
      console.error('Failed to delete task:', error)
      setIsDeleting(false)
    }
  }

  return (
    <div className={`bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 ${
      (isTogglingComplete || isDeleting) ? 'opacity-60 pointer-events-none' : ''
    }`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 pt-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggle}
            disabled={isTogglingComplete || isDeleting}
            className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <a
            href={`/tasks/${task.id}`}
            className="block group"
          >
            <h3 className={`text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors ${
              task.completed ? 'line-through text-gray-400' : 'text-gray-900'
            }`}>
              {task.title}
            </h3>
          </a>
          
          {task.description && (
            <p className={`text-base mb-3 line-clamp-2 ${
              task.completed ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(task.created_at).toLocaleDateString()}
            </span>
            {task.completed && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                ✓ Completed
              </span>
            )}
          </div>
        </div>

        <div className="flex-shrink-0">
          <button
            onClick={handleDelete}
            disabled={isDeleting || isTogglingComplete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete task"
          >
            {isDeleting ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
