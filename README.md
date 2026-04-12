# Conspire

Hey! This is Conspire, our intelligence dashboard project. We tried to make it look like a cool "Cyber-Noir" hacking terminal where you can scrape data from places like Reddit, 4chan, and news sites. 

## What it is
Basically its divided into two main folders:
- `frontend`: The UI part. It's made with React and Tailwind. We made it look really dark and hacking-themed with CRT scanline effects.
- `backend`: The server part. It's written in Node.js and Express, and saves data to MongoDB. It handles looking up the keywords on different sites and managing user logins.

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, Framer Motion
- Backend: Node.js, Express, MongoDB (Mongoose), JWT for logins. 

## How to run it

If you want to run it the normal way:

1. For the backend:
Go into `00conspire_backend` and run `npm install`. Make sure you create a `.env` file first (check the backend readme for what to put in it). Then run `npm run dev`.

2. For the frontend:
Open a new terminal, go into `01conspire_frontend`, run `npm install`, then run `npm run dev`. The website will usually run on localhost:5173.

### Docker (easiest way)
If you don't want to install all the node modules and set up mongo locally, we set it up so you can just use docker-compose instead. 
Just run this in the main folder:
`docker-compose up --build`
It will build the images and start both the frontend and backend and link them up automatically.

## How it works together
1. You go to the frontend and login or register. The backend verifies the password and sends back a JWT token.
2. The frontend saves this token in local storage and uses it for every API call after that.
3. When you search for a target, the frontend calls the `/scrape/:keyword` backend route. The backend then goes out to Reddit/4chan/etc to get data and saves it in Mongo.
4. Then the frontend pulls that data from the `/collect` route to show it on the screens. There's also a trending page that just uses Google News RSS.
