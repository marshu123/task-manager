import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from sqlalchemy import Boolean, Integer, String, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://taskuser:taskpassword@localhost:5432/taskmanager",
)

engine = create_engine(DATABASE_URL)


class Base(DeclarativeBase):
    pass


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)


class TaskCreate(BaseModel):
    title: str


class TaskUpdate(BaseModel):
    completed: bool


class TaskResponse(BaseModel):
    id: int
    title: str
    completed: bool

    model_config = ConfigDict(from_attributes=True)


Base.metadata.create_all(engine)

app = FastAPI(title="Task Manager API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Task Manager API is running"}


@app.get("/tasks", response_model=list[TaskResponse])
def get_tasks():
    with Session(engine) as session:
        return session.scalars(select(Task).order_by(Task.id)).all()


@app.post("/tasks", status_code=201, response_model=TaskResponse)
def create_task(task: TaskCreate):
    title = task.title.strip()

    if not title:
        raise HTTPException(status_code=400, detail="Task title is required")

    with Session(engine) as session:
        new_task = Task(title=title)
        session.add(new_task)
        session.commit()
        session.refresh(new_task)
        return new_task


@app.patch("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, update: TaskUpdate):
    with Session(engine) as session:
        task = session.get(Task, task_id)

        if task is None:
            raise HTTPException(status_code=404, detail="Task not found")

        task.completed = update.completed
        session.commit()
        session.refresh(task)
        return task


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    with Session(engine) as session:
        task = session.get(Task, task_id)

        if task is None:
            raise HTTPException(status_code=404, detail="Task not found")

        session.delete(task)
        session.commit()
        return {"message": "Task deleted"}