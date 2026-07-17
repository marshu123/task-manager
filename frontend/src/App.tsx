import { FormEvent, useEffect, useMemo, useState } from 'react'
import './App.css'

const API_URL = 'http://127.0.0.1:8000'

type Task = {
  id: number
  title: string
  completed: boolean
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const completedCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks],
  )

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch(`${API_URL}/tasks`)
        if (!response.ok) throw new Error()
        setTasks(await response.json())
      } catch {
        setError('Could not connect to the Task Manager API.')
      } finally {
        setLoading(false)
      }
    }

    void loadTasks()
  }, [])

  async function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const title = newTask.trim()
    if (!title) return

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })

      if (!response.ok) throw new Error()

      const task: Task = await response.json()
      setTasks((currentTasks) => [...currentTasks, task])
      setNewTask('')
    } catch {
      setError('Could not add the task. Please try again.')
    }
  }

  async function toggleTask(task: Task) {
    try {
      const response = await fetch(`${API_URL}/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      })

      if (!response.ok) throw new Error()

      const updatedTask: Task = await response.json()
      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === updatedTask.id ? updatedTask : item,
        ),
      )
    } catch {
      setError('Could not update the task. Please try again.')
    }
  }

  async function deleteTask(id: number) {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error()

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id),
      )
    } catch {
      setError('Could not delete the task. Please try again.')
    }
  }

  return (
    <main className="app-shell">
      <section className="task-card">
        <p className="eyebrow">FULL-STACK PORTFOLIO PROJECT</p>
        <h1>Task Manager</h1>
        <p className="subtitle">
          A React, TypeScript, and FastAPI application built by Marshid P.
        </p>

        <div className="progress">
          <strong>{completedCount} of {tasks.length} completed</strong>
          <span>{tasks.length - completedCount} remaining</span>
        </div>

        <form className="task-form" onSubmit={addTask}>
          <input
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
            placeholder="Add a new task..."
            aria-label="New task"
          />
          <button type="submit">Add task</button>
        </form>

        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className={task.completed ? 'completed' : ''}>
                <label>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => void toggleTask(task)}
                  />
                  <span>{task.title}</span>
                </label>
                <button
                  className="delete-button"
                  onClick={() => void deleteTask(task.id)}
                  type="button"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App