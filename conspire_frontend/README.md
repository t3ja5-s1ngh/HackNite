# Conspire - Intelligence Dashboard Frontend

This is the frontend code for **Conspire**, an intelligence and threat-tracking dashboard. The web interface is built with a dark, terminal-style aesthetic, featuring pure black backgrounds, monospace fonts, and live data logs.

## Tech Stack

- **Framework**: [React.js](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for strict, utility-based layout and styling.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for fluid transitions, terminal read-outs, and micro-interactions (including the signature rotating triangle emblem).
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: `react-router-dom`
- **Networking**: `axios` for executing asynchronous queries to intelligence APIs.

## Architecture

The app acts as a secure terminal UI built around a dedicated set of immersive pages:

### `Auth.jsx`
The **Clearance Protocol** gateway. Features a subtle particle network background, handling operative registration and secure login protocols.

### `Home.jsx`
The **Intelligence Central** dashboard. Users oversee trending threat signals, intelligence summaries, and can issue new tracking directives by deploying scrapers against target keywords. 

### `Results.jsx`
The **Data Stream Terminal**. Offers granular, real-time terminal read-outs related to specific intelligence endpoints. Operations are presented in an immersive, dynamically typing log format that replicates raw datalinks.

## Deployment (Railway)

This frontend has been engineered for immediate deployment on **Railway**. An Express wrapper (`server.js`) natively acts as a fast, dedicated server for production-built static assets.

1. Connect your repository to a new Railway project.
2. In Railway's **Variables** tab, set your `VITE_API_URL` to point to a live backend (e.g., `https://your-api.up.railway.app`).
3. Railway automatically recognizes the layout, building via `npm run build` and serving the SPA properly via the `node server.js` start script.

## Running Locally

1. Install module dependencies:
   ```bash
   npm install
   ```
2. Establish a `.env` file at the root tracking your local API server:
   ```bash
   VITE_API_URL=http://localhost:5000
   ```
3. Boot the environment in developer mode:
   ```bash
   npm run dev
   ```
4. Access the interface at `http://localhost:5173`.
