# Conspire Backend API

This is the backend server for our project. It handles all the scraping logic (Reddit, 4chan, Mastodon, News) and talks to the MongoDB database. It also takes care of JWT authentication so not just anyone can use the scrapers.

## Requirements
- Node.js installed
- MongoDB (you can run it locally or use Atlas)

## Setup and Environment Variables

Before you start, you HAVE to make a `.env` file in this folder. Otherwise the server will crash instantly.

Make your `.env` look like this:
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/conspire
JWT_SECRET=demo_secret_key_123
```

To run it:
Run `npm install` to get the packages.
Then run `npm run dev` (this uses nodemon so you don't have to keep restarting the server every time you save a file).

## Database
We used Mongoose for the DB. You don't need to run any specific database migration commands or anything complicated. Once you connect to Mongo and run the app, Mongoose automatically creates the collections (`users` and `datas`) based on the schemas we made in the `/models` folder whenever data gets inserted.

## Authentication
We used Bearer tokens (JWT). 
When a user logs in or registers successfully, they get a token back. Every other route needs the frontend to send `Authorization: Bearer <token>` in the headers, otherwise the `verifyToken` middleware in `services/AuthService.js` blocks them from doing anything.

## API Endpoints

### Public Routes
- `POST /login` -> send `{username, password}`, it sends back `{token: ...}` if it works.
- `POST /register` -> send `{username, password}`, makes a new user.

### Protected Routes (Need Token)
- `GET /scrape/:keyword` -> Tell the backend to start scraping. It runs the scripts for 4chan, Reddit, Mastodon, and News at the exact same time. There's a rate limiter on this so you can only do it 5 times every 15 minutes per user, mostly so we don't get banned from the sites we are scraping.
- `GET /collect?keyword=something` -> Gets the scraped data out of the MongoDB database after it's done.
- `GET /trending` -> Grabs the top 10 trending news items from Google News RSS to show on the homepage.

### Admin
- `DELETE /api/admin/clear-database` -> Wipes all the scraped data from the DB if it gets too full.
