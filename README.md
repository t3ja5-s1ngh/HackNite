# Conspire

Conspire is a full-stack research and scraping platform that collects keyword-driven intelligence from news, Reddit, Mastodon, and 4chan, then surfaces it through a polished React frontend.

## What it is

The project is designed to:
- authenticate users via username/password
- fetch and aggregate content from multiple social and news sources
- store scraped records in MongoDB
- present confirmation vs unconfirmed intelligence in a futuristic UI
- optionally surface trending topics with image thumbnails

## Tech stack

- Backend: Node.js, Express, MongoDB, Mongoose, JWT authentication
- Frontend: React, Vite, Tailwind CSS, Axios
- Services: custom scraping adapters for 4chan, Reddit, Mastodon, and news feeds
- Rate limiting: per-user scrape throttling via `express-rate-limit`

## High-level architecture

- `conspire_backend/`
  - Express API server
  - JWT login/register
  - `/scrape/:keyword` aggregator endpoint
  - `/collect` data fetch endpoint
  - MongoDB persistence
  - internal `services/` modules for crawler integrations

- `conspire_frontend/`
  - React app with routes for auth, search, and results
  - reads `VITE_API_URL` from environment to call backend APIs
  - stores `Authorization` tokens in `localStorage`

### How frontend and backend communicate

The frontend calls the backend through a base URL configured by `VITE_API_URL`, for example:
- `POST /login`
- `POST /register`
- `GET /scrape/:keyword`
- `GET /collect?keyword=...`
- `GET /trending`

The backend requires `Authorization: Bearer <token>` on protected routes such as `/scrape/:keyword` and `/trending`.

## Local setup

### Prerequisites

- Node.js (recommended 18+)
- npm
- MongoDB
- Optional: Unsplash API key for trending image thumbnails

### Backend setup

1. Open `conspire_backend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with at least:
   ```env
   MONGO_URI=mongodb://localhost:27017/conspire
   UNSPLASH_KEY=your_unsplash_api_key
   PORT=5000
   ```
4. Start the backend:
   ```bash
   npm run dev
   ```

### Frontend setup

1. Open `conspire_frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the frontend:
   ```bash
   npm run dev
   ```
5. Open the URL shown by Vite, usually `http://localhost:5173`

## Docker Compose

A `docker-compose.yml` file is not included by default, but the project can be containerized with a simple compose setup.

Example `docker-compose.yml`:

```yaml
version: '3.9'
services:
  backend:
    image: node:20
    working_dir: /app
    volumes:
      - ./conspire_backend:/app
    command: sh -c "npm install && npm run dev"
    ports:
      - '5000:5000'
    environment:
      - MONGO_URI=mongodb://mongo:27017/conspire
      - UNSPLASH_KEY=${UNSPLASH_KEY}
  frontend:
    image: node:20
    working_dir: /app
    volumes:
      - ./conspire_frontend:/app
    command: sh -c "npm install && npm run dev -- --host 0.0.0.0"
    ports:
      - '5173:5173'
    environment:
      - VITE_API_URL=http://localhost:5000
  mongo:
    image: mongo:7
    ports:
      - '27017:27017'
```

> Note: this compose example assumes host-based access to the backend from the frontend container. If running both in containers, adjust `VITE_API_URL` to use the backend service hostname.

## Backend API reference

The backend is implemented in `conspire_backend/server.js`.

### Main endpoints

- `GET /` - health check
- `POST /login` - authenticate user and return `Bearer` token
- `POST /register` - create a new user
- `GET /scrape/:keyword` - scrape all sources for a keyword (requires auth, rate-limited)
- `GET /collect` - retrieve stored scraped data, optional `status` and `keyword` filters
- `GET /trending` - fetch trending keywords and image thumbnails (requires auth)
- `DELETE /admin/clear` - clear stored data from MongoDB

For full backend operator guidance, see `backend/README.md`.
