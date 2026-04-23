# PrepEdge AI

Precision-engineered interview preparation platform powered by AI.

## Features
- **Company-Wise Filtering**: Tailor your preparation to specific target companies.
- **Expert Insights**: AI-generated questions and answers for elite interview performance.
- **Glassmorphism UI**: High-end, interactive design optimized for all devices.
- **Usage Limits**: Smart tracking for premium features.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Vite.
- **Backend**: Spring Boot, Java 21, PostgreSQL.
- **AI**: Groq API (Llama 3.1).

## Deployment
### 1. Backend (Back4App Containers)
This project is optimized for **Back4App**. To deploy:
1. Push this code to GitHub.
2. Connect your repo to Back4App Containers.
3. Set these Environment Variables in the Back4App dashboard:
   - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://<your-supabase-host>:5432/postgres?sslmode=require`
   - `SPRING_DATASOURCE_USERNAME`: `postgres.<your-project-id>`
   - `SPRING_DATASOURCE_PASSWORD`: `<your-supabase-password>`
   - `GROQ_API_KEY`: Your Groq API key.
   - `CORS_ALLOWED_ORIGINS`: `*` (or your frontend URL).

### 2. Frontend (Vercel/Netlify)
- Deploy the `frontend` folder.
- Set `VITE_API_BASE_URL` to your Back4App App URL.

## Setup
1. Clone the repository.
2. Set environment variables locally or in `.env` (frontend).
3. Run `mvn clean install` for backend.
4. Run `npm install && npm run build` for frontend.
