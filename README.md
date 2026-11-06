# 🎬 CineSphere — Cinema. Community.

### Discover Movies. Share Reviews. Connect Through Cinema.

CineSphere is a full-stack movie discovery and community platform designed to bring cinema enthusiasts together. It combines movie exploration, personalized watchlists, movie ratings, AI-powered sentiment analysis, and social interactions into one cinematic experience.

More than just a movie discovery application, CineSphere aims to create a space where users can explore movies, share opinions, discuss cinema, and understand the community's perception of films.

**Project Status:** Core Features Implemented | Final Development & Deployment in Progress 🚧

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [AI-Powered Features](#-ai-powered-features)
- [Technology Stack](#️-technology-stack)
- [Project Architecture](#-project-architecture)
- [Development Progress](#-development-progress)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Future Scope](#-future-scope)
- [Contributors](#-contributors)

---

## 🌟 Overview

CineSphere brings together three major aspects of the movie experience:

- **Discovery:** Find movies, explore details, and discover cast information.
- **Community:** Share posts, write reviews, rate movies, and interact with other users.
- **Intelligence:** Analyze community sentiment and visualize audience reactions through AI-powered insights.

The platform features a cinematic design inspired by moonlight, midnight skies, deep oceans, and cinematic noir.

---

## ✨ Key Features

### 🔐 1. User Authentication
- User registration and login.
- JWT-based authentication.
- Password hashing using bcryptjs.
- Protected backend routes.
- MongoDB Atlas integration.

### 🎥 2. Movie Discovery
- Movie search and discovery.
- TMDB API integration.
- Movie details and cast information.
- Movie posters and metadata.
- Explore movie information through a dedicated interface.

### ❤️ 3. Personal Watchlist & Favorites
- Add movies to a personal watchlist.
- Save favorite movies.
- User-specific movie collections.
- Persistent storage through the backend.

### 👥 4. Community Platform
- Create community posts.
- Like and comment on posts.
- Share movie-related opinions.
- Community reviews.
- Spoiler support for movie discussions.
- Movie ratings on a scale of 1–10.

### 🤖 5. AI-Powered Sentiment Analysis
CineSphere incorporates AI-powered sentiment analysis to understand audience opinions and reactions.

The system classifies community sentiment into three categories:

- 🟢 Positive
- 🟡 Neutral
- 🔴 Negative

This helps users understand the overall perception of movies based on community discussions and reviews.

### 📊 6. Community Sentiment Dashboard
- Visual representation of audience sentiment.
- Community opinion insights.
- Sentiment distribution across reviews and discussions.

### 🔥 7. Hype Meter
A basic Hype Meter provides an overview of community interest and excitement surrounding movies.

**Hype Meter 2.0** is planned to introduce improved tracking and visualization.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend development |
| JavaScript | Application logic |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Lucide React | Icons |
| Node.js | Backend runtime |
| Express.js | REST API development |
| MongoDB Atlas | Cloud database |
| Mongoose | Database modeling |
| JWT | Authentication |
| bcryptjs | Password hashing |
| TMDB API | Movie data and metadata |
| AI / NLP | Sentiment analysis |

---

## 🏗️ Project Architecture

CineSphere follows a frontend-backend architecture.

```text
                 CINESP H E R E
                       |
          +------------+------------+
          |                         |
      FRONTEND                   BACKEND
          |                         |
       React                    Node.js
          |                         |
    Tailwind CSS                Express.js
          |                         |
   Framer Motion              REST APIs
          |                         |
          |                   JWT Authentication
          |                         |
          |                    Mongoose
          |                         |
          |                    MongoDB Atlas
          |                         |
          +------------+------------+
                       |
                EXTERNAL SERVICES
                       |
                +------+------+
                |             |
             TMDB API     AI Sentiment
                           Analysis
```

---

## ✅ Development Progress

### Completed Features

- [x] Cinematic frontend interface.
- [x] User signup and login.
- [x] JWT authentication.
- [x] MongoDB Atlas integration.
- [x] TMDB API integration.
- [x] Movie search and discovery.
- [x] Movie details and cast information.
- [x] Personalized watchlist.
- [x] Favorites functionality.
- [x] Community posts.
- [x] Likes and comments.
- [x] Spoiler support.
- [x] Community reviews.
- [x] Movie ratings (1–10).
- [x] AI-powered sentiment analysis.
- [x] Positive, Neutral and Negative sentiment classification.
- [x] Community sentiment dashboard.
- [x] Basic Hype Meter.
- [x] Node.js and Express backend APIs.
- [x] React frontend with Tailwind CSS and Framer Motion.

### 🚧 Currently Under Development

- [ ] Hype Meter 2.0.
- [ ] Dynamic Home Page.
- [ ] Complete User Profile Dashboard.
- [ ] Final polish for Reviews and Ratings.
- [ ] Community feed sorting and improvements.
- [ ] Mobile responsiveness.
- [ ] UI/UX and animation improvements.
- [ ] Production-level security and error handling.
- [ ] Frontend and backend deployment.
- [ ] Custom domain integration.
- [ ] Final testing and bug fixes.
- [ ] Complete project documentation.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB Atlas account or MongoDB instance
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/SrijalSrivastava19/Cinesphere.git

cd Cinesphere
```

### 2. Install Dependencies

Install the frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the backend directory.

Add your credentials:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
TMDB_API_KEY=your_tmdb_api_key
```

Configure any additional environment variables required by the AI sentiment analysis service.

### 4. Start the Backend

```bash
cd backend
npm run dev
```

### 5. Start the Frontend

Open another terminal in the frontend directory:

```bash
npm run dev
```

The application should now be available locally.

*Note: Check the current package.json scripts and actual folder structure before following these commands. Additional configuration may be required.*

---

## 🔮 Future Scope

CineSphere aims to evolve into a complete movie discovery and social engagement platform.

Planned improvements include:

- 🔥 Advanced Hype Meter with improved community engagement tracking.
- 🎯 Personalized movie recommendation system.
- 📈 Advanced audience sentiment analytics.
- 👤 Complete user profiles and activity tracking.
- 🌐 Production deployment and custom domain.
- 📱 Improved mobile experience.
- 🎬 More advanced movie discovery and filtering.
- 💬 Enhanced community interaction features.

---

## 👨‍💻 Contributors

CineSphere is being developed collaboratively.

### Srijal Srivastava
**Project Developer & Backend Contributor**

- Backend development using Node.js and Express.js.
- MongoDB integration and database modeling.
- Authentication and JWT implementation.
- TMDB API integration.
- Watchlist and community backend functionality.
- AI sentiment analysis integration.

GitHub: [SrijalSrivastava19](https://github.com/SrijalSrivastava19)

### Prachi Mishra
**Frontend Contributor**

- Frontend development and UI implementation.
- Contribution to the CineSphere frontend experience.

GitHub: [2006prachimishra-ship-it](https://github.com/2006prachimishra-ship-it)

---

## 🎯 Our Vision

**CineSphere — Where Cinema Meets Community.**

We believe cinema is more than just watching movies. It's about discovering stories, sharing opinions, understanding audience perspectives, and connecting with people who love films.

CineSphere aims to bring all of these experiences together in one platform.

⭐ If you find this project interesting, consider starring the repository!
