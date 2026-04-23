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
### 1. Render Blueprint (Recommended)
This project is configured for **Render Blueprints**. To deploy everything (Backend, Frontend, and Database) at once:
1. Push this code to your GitHub repository.
2. In the Render Dashboard, click **New +** > **Blueprint**.
3. Select your repository.
4. Render will automatically detect the `render.yaml` and set up all services.

### 2. Manual Deployment
- **Frontend**: Deploy the `frontend` folder to Vercel/Netlify.
- **Backend**: Deploy the root directory to Railway/Render using the provided `Dockerfile`.

## Setup
1. Clone the repository.
2. Set environment variables:
   - `GROQ_API_KEY`: Your Groq API key.
   - `SPRING_DATASOURCE_URL`: PostgreSQL connection string.
   - `SPRING_DATASOURCE_PASSWORD`: DB password.
   - `CORS_ALLOWED_ORIGINS`: Production frontend URL.
3. Run `mvn clean install` for backend.
4. Run `npm install && npm run build` for frontend.
