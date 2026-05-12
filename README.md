# FastAPI-technicaltest

# build imagen docker
docker compose up --build

# Levantar entorno virtual
# venv
./venv/Scripts/Activate.ps1

# Lanzar Backend (desde entorno virtual)
uvicorn main:app --reload --app-dir app

# Lanzar Frontend (desde entorno virtual)
cd frontend
npm run dev


# ACCESO

# Frontend (React)
localhost:5173

# Swagger
localhost:8000/docs

# API base
localhost:8000

# OpenAPI
localhost:8000/openapi.json