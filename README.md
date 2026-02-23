# myFlix Movie API

Professional-grade REST API that powers the myFlix application. It exposes movie, genre, and director data, supports account management, and lets users maintain a list of favorite movies. Built with Node.js, Express, and MongoDB.

## Highlights
- RESTful endpoints for movies, genres, directors, and users
- JWT-based authentication for protected routes
- User registration, profile updates, and account deletion
- Favorite-movies list management

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- Authentication: Passport (Local + JWT)
- Middleware: body-parser, morgan, cors, express-validator

## Getting Started

### Prerequisites
- Node.js (LTS recommended)
- MongoDB instance (local or cloud)

### Install
```bash
npm install
```

### Environment Variables
Create a `.env` file (or set these in your deployment environment) and do not commit it:

```bash
CONNECTION_URI=<your-mongodb-connection-string>
```

Note: Store secrets (like JWT signing keys) in environment variables and rotate them regularly. Avoid putting secrets in source control.

### Run
```bash
npm start
```

The API listens on port `8080` by default.

## API Overview

### Movie Endpoints
<img width="1917" height="233" alt="movie_endpoints" src="https://github.com/user-attachments/assets/f8af15bc-aaf1-4174-ab43-3eaf3e54706d" />

### User Endpoints
<img width="1912" height="603" alt="user_endpoints" src="https://github.com/user-attachments/assets/dd580752-e150-47d7-8303-ab3354d3a4c1" />

## Core Features
- Return a list of all movies
- Return a single movie by title (includes genre, director, and image data)
- Return genre data by name
- Return director data by name
- Register new users
- Update user profile data (username, password, email, birthday)
- Add a movie to favorites
- Remove a movie from favorites
- Deregister users

## Deployment
This API is compatible with standard Node.js hosts (e.g., Heroku, Render, Railway). Set `CONNECTION_URI` and any JWT secret in the host environment.

## Testing
Use Postman (or similar) to exercise the endpoints. Protected routes require a valid JWT issued by the `/login` endpoint.

