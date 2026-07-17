from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Task Manager API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class TaskCreate(BaseModel):
    title: str

class TaskUpdate(BaseModel):
    completed: bool

tasks = [
    {"id": 1, "title": "Build FastAPI backend", "completed": True},
    {"id": 2, "title": "Create React frontend", "completed": False},
    {"id": 3, "title": "Containerize the application", "completed": False},
]

@app.get("/")
def home():
    return {"message": "Task Manager API is running"}

@app.get("/tasks")
def get_tasks():
    return tasks

@app.post("/tasks", status_code=201)
def create_task(task: TaskCreate):
    new_task = {
        "id": max((item["id"] for item in tasks), default=0) + 1,
        "title": task.title.strip(),
        "completed": False,
    }

    if not new_task["title"]:
        raise HTTPException(status_code=400, detail="Task title is required")

    tasks.append(new_task)
    return new_task

@app.patch("/tasks/{task_id}")
def update_task(task_id: int, update: TaskUpdate):
    for task in tasks:
        if task["id"] == task_id:
            task["completed"] = update.completed
            return task

    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    for task in tasks:
        if task["id"] == task_id:
            tasks.remove(task)
            return {"message": "Task deleted"}

    raise HTTPException(status_code=404, detail="Task not found")