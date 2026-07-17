import { FormEvent, useMemo, useState } from 'react'
import './App.css'

type Task = {
  id: number
  title: string
  completed: boolean
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Build FastAPI backend', completed: true },
    { id: 2, title: 'Create React frontend', completed: false },
    { id: 3, title: 'Containerize the application', completed: false },
  ])
  const [newTask, setNewTask] = useState('')

  const completedCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks],
  )

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const title = newTask.trim()
    if (!title) return

    setTasks((currentTasks) => [
      ...currentTasks,
      { id: Date.now(), title, completed: false },
    ])
    setNewTask('')
  }

  function toggleTask(id: number) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  function deleteTask(id: number) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id),
    )
  }

  return (
    <main className="app-shell">
      <section className="task-card">
        <p className="eyebrow">FULL-STACK PORTFOLIO PROJECT</p>
        <h1>Task Manager</h1>
        <p className="subtitle">
          A React and FastAPI application built by Marshid P.
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

        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={task.completed ? 'completed' : ''}>
              <label>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span>{task.title}</span>
              </label>
              <button
                className="delete-button"
                onClick={() => deleteTask(task.id)}
                type="button"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default App