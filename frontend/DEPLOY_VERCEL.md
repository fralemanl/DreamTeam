# Deploy Frontend en Vercel

## 1) Importar repositorio
- Entra a Vercel y selecciona **Add New Project**.
- Importa el repo `fralemanl/famquiniela` (o el nuevo repo que crees para DreamTeam).

## 2) Configurar proyecto
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm ci && npx vite build`
- **Output Directory**: `dist`

Nota: estas opciones ya estan reflejadas en `frontend/vercel.json`.

## 3) Variables de entorno
Crea esta variable en Vercel (Project Settings -> Environment Variables):

- `VITE_API_URL` = URL publica de tu backend en Railway, por ejemplo:
  - `https://dreamteam-backend.up.railway.app`

Puedes usar `frontend/.env.example` como referencia.

## 4) Deploy
- Haz clic en **Deploy**.
- Al terminar, abre la URL publicada por Vercel.

## 5) Validacion rapida
- Abre la app y prueba login/registro.
- Si el frontend no conecta con backend, revisa:
  - que `VITE_API_URL` exista y no termine con `/api`
  - que en backend Railway este configurado `CORS_ORIGINS` incluyendo tu dominio Vercel

## 6) Dominio Vercel en backend
En Railway (servicio backend), variable recomendada:

- `CORS_ORIGINS=https://tu-app.vercel.app,http://localhost:5173`

Si tienes dominio custom, agregalo tambien separado por comas.
