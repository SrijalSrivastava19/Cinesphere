# 🎬 CineSphere — Cinema. Community.

**Discover movies. Build your watchlist. Connect with movie lovers.**

CineSphere is a full-stack movie discovery and community platform designed to bring cinema enthusiasts together. It combines movie exploration, personalized watchlists, user profiles, and social interaction in one place.

The goal is to create more than just a movie browsing website — CineSphere aims to build a community where people can discover, discuss, review, and share their love for cinema.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [Project Architecture](#-project-architecture)
- [Work Completed](#-work-completed)
- [Development Roadmap](#-development-roadmap)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Overview](#-api-overview)
- [Future Vision](#-future-vision)
- [Contributors](#-contributors)

---

## 🌟 Overview

CineSphere is being developed as a full-stack web application with a modern cinematic interface and a backend that supports user authentication, movie data, and personalized user interactions.

The platform uses The Movie Database (TMDB) API to retrieve movie information and provide movie posters and details.

Its interface follows a visual theme inspired by:

- 🌙 Moonlight
- 🌌 Midnight Sky
- 🌊 Deep Ocean
- 🎞️ Cinematic Noir

The application is being developed with scalability, responsiveness, and user experience in mind.

---

## ✨ Key Features

### 🎥 Movie Discovery
- Explore movies through a cinematic interface.
- Retrieve movie information using the TMDB API.
- Display movie posters and details.
- Discover trending and popular movie content.

### 🔐 User Authentication
- User registration and login.
- Password hashing using bcrypt.
- JWT-based authentication architecture.
- Protected backend routes.

### ❤️ Personal Watchlist
- Add movies to a personal watchlist.
- Retrieve saved movies.
- User-specific watchlist management.

### 👥 Community
- Community feed foundation.
- Community post and comment data models.
- Planned movie discussions and user interactions.

### 👤 User Profiles
- Profile page interface.
- Foundation for personalized user information.
- Planned user activity and watchlist integration.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js / React | Frontend development |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Lucide React | Icons |
| Node.js | Backend runtime |
| Express.js | Backend framework |
| MongoDB | Database |
| Mongoose | Database modeling |
| JWT | Authentication |
| bcryptjs | Password hashing |
| TMDB API | Movie data and posters |

---

## 🏗️ Project Architecture

The project follows a frontend-backend architecture.

```text
CineSphere/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── data/
│   │   └── styles/
│   │
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── CommunityPost.js
│   │   └── Comment.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   └── watchlist.js
│   │
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
└── README.md
```

*Note: This is a logical overview of the project structure. Folder and file names may differ in the current repository.*

---

## ✅ Work Completed

The following work has been implemented during the development process:

### Frontend Development
- Created the CineSphere cinematic interface.
- Developed the navigation and main application layout.
- Implemented Home and Discover interfaces.
- Developed Community, Watchlist, and Profile pages.
- Created reusable movie cards and UI components.
- Added animations using Framer Motion.
- Established the visual theme and styling system.

### Backend Development
- Set up a Node.js and Express.js backend.
- Established MongoDB connectivity using Mongoose.
- Created the User model.
- Implemented user signup functionality.
- Integrated bcryptjs for password hashing.
- Implemented and tested user login functionality.
- Established JWT-based authentication.
- Created authentication middleware and protected route foundations.

### TMDB Integration
- Integrated The Movie Database API.
- Implemented movie data retrieval.
- Worked on movie poster rendering.
- Fixed movie poster display issues.

### Watchlist
- Implemented the GET `/api/watchlist` endpoint.
- Implemented the POST `/api/watchlist/:movieId` endpoint.
- Connected watchlist operations with authentication.

### Community Foundation
- Started the community backend structure.
- Created community post and comment schema foundations.
- Established the initial structure for social interactions.

---

## 🚧 Development Roadmap

CineSphere is actively under development. The following features represent the remaining development goals.

### Phase 1 — Frontend & User Experience
- [x] Cinematic UI development
- [x] Main navigation
- [x] Movie cards and layouts
- [x] Core page interfaces
- [ ] Complete responsive design across devices
- [ ] Improve loading and error states

### Phase 2 — Authentication & Backend
- [x] Express backend setup
- [x] MongoDB integration
- [x] User registration
- [x] User login
- [x] Password hashing
- [x] JWT authentication foundation
- [ ] Complete protected frontend routes
- [ ] Add token refresh and session handling
- [ ] Improve backend validation and security

### Phase 3 — Movie Discovery
- [x] TMDB API integration
- [x] Movie poster integration
- [ ] Complete movie detail pages
- [ ] Search movies by title
- [ ] Genre-based filtering
- [ ] Trending and popular movie sections
- [ ] Pagination and optimized API requests

### Phase 4 — Watchlist
- [x] Watchlist backend endpoints
- [ ] Complete frontend-backend integration
- [ ] Remove movies from watchlist
- [ ] Prevent duplicate entries
- [ ] Persist and synchronize watchlist data

### Phase 5 — Community & Social Features
- [x] Community data model foundations
- [ ] Create and publish posts
- [ ] Like and comment functionality
- [ ] Movie reviews and ratings
- [ ] User-to-user interactions
- [ ] Community feed integration

### Phase 6 — User Profiles
- [x] Initial profile interface
- [ ] Dynamic user profile data
- [ ] Profile editing
- [ ] User activity history
- [ ] Display user reviews and watchlist

### Phase 7 — Testing & Deployment
- [ ] API testing and validation
- [ ] Frontend and backend integration testing
- [ ] Error handling and performance optimization
- [ ] Production environment configuration
- [ ] Frontend deployment
- [ ] Backend deployment
- [ ] Database production configuration

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/SrijalSrivastava19/Cinesphere.git

cd Cinesphere
```

### 2. Install Dependencies

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the backend directory and configure the required credentials.

### 4. Start the Backend

```bash
cd backend
npm run dev
```

### 5. Start the Frontend

Open another terminal in the frontend project directory:

```bash
npm run dev
```

The frontend and backend should now be running locally.

*Note: Development scripts and frontend directory paths should be checked against the current package.json files.*

---

## 🔑 Environment Variables

Backend `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
TMDB_API_KEY=your_tmdb_api_key
```

Frontend environment variables, if required:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Never upload `.env` files, API secrets, database credentials, or JWT secrets to GitHub.

---

## 📡 API Overview

The following endpoints have been implemented or started:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/signup` | Register a user |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/watchlist` | Retrieve user watchlist |
| POST | `/api/watchlist/:movieId` | Add movie to watchlist |

Additional endpoints for movie discovery, community interactions, comments, reviews, and profile management are planned.

---

## 🔮 Future Vision

Our long-term vision is to transform CineSphere into a complete cinema community platform.

Potential future additions include:

- Personalized movie recommendations.
- Advanced movie search and discovery.
- User ratings and detailed reviews.
- Social feeds and community discussions.
- Following other movie enthusiasts.
- Personalized movie collections.
- Improved recommendation algorithms.

---

## 👨‍💻 Contributors

Developed as a collaborative full-stack development project.

**GitHub Repository:**  
https://github.com/SrijalSrivastava19/Cinesphere

**Developer:**  
Srijal Srivastava

---

## 🎬 Our Vision

**CineSphere — Where Cinema Meets Community.**

A place where every movie has a story, every viewer has an opinion, and every cinema enthusiast has a community.
