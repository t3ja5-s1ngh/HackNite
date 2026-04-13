# Backend Documentation

This document covers the backend server in the Conspire project.

> The backend application code lives in `conspire_backend/`.

## Overview

The backend is an Express.js API server that connects to MongoDB and exposes authentication, scraping, data collection, and trending endpoints.

### Key responsibilities

- user registration and login
- JWT-based authentication
- scraping data from 4chan, news, Reddit, and Mastodon
- storing scraped records in MongoDB
- exposing filtered search and trending endpoints

## Environment variables

Create a `.env` file in `conspire_backend/` with the following values:

- `MONGO_URI` - MongoDB connection string
- `UNSPLASH_KEY` - Unsplash API key used by `/trending`
- `PORT` - optional port number, defaults to `5000`

Example:

```env
MONGO_URI=mongodb://localhost:27017/conspire
UNSPLASH_KEY=your_unsplash_api_key
PORT=5000
```

### Important note

The current code uses a hard-coded JWT secret inside `conspire_backend/services/AuthService.js`:

```js
const SECRET = "demo_secret_key_123";
```

For production, replace this with a secure runtime secret and update the middleware accordingly.

## Start commands

From `conspire_backend/`:

```bash
npm install
npm run dev
```

To run in production mode:

```bash
npm run start
```

## Database and migrations

There is no database migration tool configured in this repository.
The MongoDB schema is managed directly through Mongoose models in `conspire_backend/models/`.

If you need to evolve the schema, update the model definitions and handle any field changes manually.

### Reset or clear the database

The backend exposes an administrative endpoint:

- `DELETE /admin/clear`

This removes all documents from the stored data collection.
Use it only for testing or local cleanup.

## API endpoints

### Public endpoints

- `GET /`
  - Simple health check that returns `News scrapper Api is running ...`

- `POST /login`
  - Request body: `{ username, password }`
  - Response: `{ token: "Bearer <jwt>" }`
  - Returns 400 if credentials are invalid

- `POST /register`
  - Request body: `{ username, password }`
  - Creates a new user document
  - Response: `{ message: "User created successfully!" }`

### Authenticated endpoints

Protected routes require the request header:

```http
Authorization: Bearer <token>
```

- `GET /scrape/:keyword`
  - Scrapes all configured sources for the provided keyword
  - Protected by JWT and rate limiting
  - Returns combined data from 4chan, news, Reddit, and Mastodon
  - Rate limit: 5 requests per user every 15 minutes

- `GET /trending`
  - Aggregates stored data by keyword and attaches an image from Unsplash
  - Requires authentication

### Data retrieval endpoint

- `GET /collect`
  - Optional query parameters:
    - `status` - filter by `status`
    - `keyword` - case-insensitive keyword search
  - Example: `/collect?keyword=cyber&status=active`
  - Returns stored records sorted by `scrapedAt` descending

### Admin endpoint

- `DELETE /admin/clear`
  - Deletes all stored `data` records
  - No authentication is required in the current implementation, so treat it as destructive admin-only functionality

## Authentication flow

1. User registers with `POST /register`
2. User logs in with `POST /login`
3. Backend returns a JWT bearer token
4. Frontend stores the token in localStorage
5. Protected requests send `Authorization: Bearer <token>`

## Data model

The main stored model is `conspire_backend/models/data.js` with fields:

- `title`
- `content`
- `url`
- `source`
- `keyword`
- `scrapedAt`
- `filter` (`media` or `official`)

## Notes for operators

- Verify `MONGO_URI` before starting the server
- `UNSPLASH_KEY` is only required for the `/trending` endpoint
- The JWT secret is currently hard-coded; migrate it to an environment variable for production
- `DELETE /admin/clear` is destructive and should only be used intentionally

## Useful file locations

- `conspire_backend/server.js` - main API routes and app initialization
- `conspire_backend/services/AuthService.js` - JWT verification middleware
- `conspire_backend/services/LimitService.js` - scrape rate limiting
- `conspire_backend/models/` - MongoDB schema definitions
