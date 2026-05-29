# FastAPI-techtest

# build imagen docker
docker compose up --build

# Levantar entorno virtual
python -m venv venv

# venv
./venv/Scripts/Activate.ps1

# Requirements
cd app
pip install -r requirements.txt

# Lanzar Backend (desde entorno virtual)
uvicorn main:app --reload --app-dir app

# Lanzar Frontend (desde entorno virtual)
cd frontend
npm install
npm run dev


# ACCESO

# Frontend (Docker)
localhost:4173

# Frontend (venv)
localhost:5173

# Swagger
localhost:8000/docs

# API base
localhost:8000

# OpenAPI
localhost:8000/openapi.json