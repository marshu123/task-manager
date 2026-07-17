\# Task Manager



A full-stack task management application built to practise modern web development, REST APIs, and containerization.



\## Features



\- View tasks from a FastAPI REST API

\- Add a new task

\- Mark a task as complete or incomplete

\- Delete a task

\- Responsive React user interface

\- Dockerized backend API



\## Tech Stack



\- Frontend: React, TypeScript, Vite

\- Backend: Python, FastAPI

\- DevOps: Docker

\- Version Control: Git and GitHub



\## Project Structure



```text

task-manager/

├── frontend/        # React + TypeScript application

├── main.py          # FastAPI backend

├── Dockerfile       # Docker configuration for the backend

└── requirements.txt # Python dependencies

```



\## Run Locally



\### 1. Start the backend



```powershell

.venv\\Scripts\\python.exe -m uvicorn main:app --reload

```



The API runs at `http://127.0.0.1:8000`.



\### 2. Start the frontend



Open a second PowerShell window:



```powershell

cd frontend

npm.cmd run dev

```



Open `http://localhost:5173` in your browser.



\## Run the Backend with Docker



```powershell

docker build -t task-manager .

docker run -d -p 8000:8000 --name task-manager-api task-manager

```



Then open `http://localhost:8000/docs` to explore the API documentation.



\## API Endpoints



| Method | Endpoint | Description |

| --- | --- | --- |

| GET | `/tasks` | Get all tasks |

| POST | `/tasks` | Create a task |

| PATCH | `/tasks/{task\_id}` | Update task completion |

| DELETE | `/tasks/{task\_id}` | Delete a task |



\## Author



Marshid P  

\[LinkedIn](https://linkedin.com/in/marshidp)

