const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = 5000;

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Authentication token required",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

// ==========================================
// BASIC TEST ROUTES
// ==========================================

app.get("/", (req, res) => {
  res.send("CineSphere Backend is running!");
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "CineSphere API is working!",
  });
});

console.log("MOVIES TEST ROUTE REGISTERED");

app.get("/api/movies-test", (req, res) => {
  console.log("MOVIES TEST REQUEST RECEIVED");

  res.json({
    message: "Movies route is working!",
  });
});

// ==========================================
// TMDB - GET MOVIES
// ==========================================
// /api/movies
// /api/movies?page=2
// /api/movies?search=avengers

app.get("/api/movies", async (req, res) => {
  console.log("MOVIES REQUEST RECEIVED");

  try {
    if (!process.env.TMDB_API_KEY) {
      return res.status(500).json({
        message:
          "TMDB_API_KEY is missing in backend/.env",
      });
    }

    const page = Math.max(
      1,
      Number.parseInt(req.query.page, 10) || 1
    );

    const search = (req.query.search || "").trim();

    const params = new URLSearchParams({
      api_key: process.env.TMDB_API_KEY,
      language: "en-US",
      page: String(page),
    });

    let endpoint;

    if (search) {
      params.set("query", search);
      params.set("include_adult", "false");

      endpoint =
        `https://api.themoviedb.org/3/search/movie?${params}`;
    } else {
      endpoint =
        `https://api.themoviedb.org/3/movie/popular?${params}`;
    }

    console.log(
      search
        ? `Searching TMDB for: ${search}`
        : `Fetching popular movies - page ${page}`
    );

    const response = await fetch(endpoint);

    if (!response.ok) {
      console.error(
        "TMDB error status:",
        response.status
      );

      return res.status(502).json({
        message:
          "TMDB could not provide movies. Check the API credentials.",
      });
    }

    const data = await response.json();

    const movies = (data.results || []).map((movie) => ({
      id: movie.id,
      title: movie.title,

      year: movie.release_date
        ? movie.release_date.slice(0, 4)
        : "N/A",

      rating: movie.vote_average,

      overview: movie.overview,

      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,

      genreIds: movie.genre_ids || [],
    }));

    res.json({
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
      movies,
    });
  } catch (error) {
    console.error(
      "TMDB fetch error:",
      error.message
    );

    res.status(500).json({
      message: "Server error while fetching movies",
    });
  }
});

// ==========================================
// TMDB - GET SINGLE MOVIE DETAILS
// ==========================================
// This route gets:
// poster
// backdrop
// tagline
// runtime
// genres
// director
// cast
// rating
// overview
// release date

app.get("/api/movies/:movieId", async (req, res) => {
  console.log(
    `MOVIE DETAILS REQUEST: ${req.params.movieId}`
  );

  try {
    if (!process.env.TMDB_API_KEY) {
      return res.status(500).json({
        message:
          "TMDB_API_KEY is missing in backend/.env",
      });
    }

    const movieId = String(
      req.params.movieId
    ).trim();

    if (!movieId) {
      return res.status(400).json({
        message: "Movie ID is required",
      });
    }

    const params = new URLSearchParams({
      api_key: process.env.TMDB_API_KEY,
      language: "en-US",
      append_to_response: "credits",
    });

    const endpoint =
      `https://api.themoviedb.org/3/movie/${encodeURIComponent(
        movieId
      )}?${params}`;

    const response = await fetch(endpoint);

    if (!response.ok) {
      console.error(
        "TMDB movie details error:",
        response.status
      );

      return res.status(404).json({
        message: "Movie not found",
      });
    }

    const movie = await response.json();

    // Find director
    const director =
      movie.credits?.crew?.find(
        (person) =>
          person.job === "Director"
      );

    // Get top 8 cast members
    const cast =
      movie.credits?.cast
        ?.slice(0, 8)
        .map((person) => ({
          id: person.id,
          name: person.name,
          character: person.character,

          profile: person.profile_path
            ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
            : null,
        })) || [];

    res.json({
      id: movie.id,

      title: movie.title,

      tagline: movie.tagline || "",

      year: movie.release_date
        ? movie.release_date.slice(0, 4)
        : "N/A",

      releaseDate:
        movie.release_date || null,

      rating: movie.vote_average,

      voteCount: movie.vote_count,

      runtime: movie.runtime || null,

      overview: movie.overview || "",

      plot: movie.overview || "",

      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,

      backdrop: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
        : null,

      genres:
        movie.genres?.map((genre) => ({
          id: genre.id,
          name: genre.name,
        })) || [],

      genreIds:
        movie.genres?.map(
          (genre) => genre.id
        ) || [],

      director: director
        ? {
            id: director.id,
            name: director.name,
          }
        : null,

      cast,
    });
  } catch (error) {
    console.error(
      "Movie details error:",
      error.message
    );

    res.status(500).json({
      message: "Could not fetch movie",
    });
  }
});

// ==========================================
// AUTH - SIGNUP
// ==========================================

app.post("/api/auth/signup", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message:
          "Name, email and password are required",
      });
    }

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message:
          "User with this email already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully!",

      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(
      "Signup error:",
      error.message
    );

    res.status(500).json({
      message: "Server error during signup",
    });
  }
});

// ==========================================
// AUTH - LOGIN TEST
// ==========================================

app.get(
  "/api/auth/login-test",
  (req, res) => {
    res.json({
      message:
        "Login route area is working!",
    });
  }
);

// ==========================================
// AUTH - LOGIN
// ==========================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Login successful!",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ==========================================
// AUTH - CURRENT USER
// ==========================================

app.get(
  "/api/auth/me",
  authenticateToken,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.userId
        ).select("-password");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.status(200).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error(
        "Get user error:",
        error.message
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// ==========================================
// WATCHLIST - GET
// ==========================================

app.get(
  "/api/watchlist",
  authenticateToken,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.userId
        ).select("watchlist");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json({
        watchlist: user.watchlist,
      });
    } catch (error) {
      console.error(
        "Fetch watchlist error:",
        error.message
      );

      res.status(500).json({
        message:
          "Could not fetch watchlist",
      });
    }
  }
);

// ==========================================
// WATCHLIST - ADD
// ==========================================

app.post(
  "/api/watchlist/:movieId",
  authenticateToken,
  async (req, res) => {
    try {
      const movieId =
        String(req.params.movieId);

      if (!movieId.trim()) {
        return res.status(400).json({
          message:
            "Movie ID is required",
        });
      }

      const user =
        await User.findById(
          req.userId
        );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      if (
        !user.watchlist.includes(
          movieId
        )
      ) {
        user.watchlist.push(movieId);

        await user.save();
      }

      res.json({
        message:
          "Movie added to watchlist",

        watchlist:
          user.watchlist,
      });
    } catch (error) {
      console.error(
        "Add watchlist error:",
        error.message
      );

      res.status(500).json({
        message:
          "Could not add movie",
      });
    }
  }
);

// ==========================================
// WATCHLIST - REMOVE
// ==========================================

app.delete(
  "/api/watchlist/:movieId",
  authenticateToken,
  async (req, res) => {
    try {
      const movieId =
        String(req.params.movieId);

      const user =
        await User.findById(
          req.userId
        );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.watchlist =
        user.watchlist.filter(
          (id) => id !== movieId
        );

      await user.save();

      res.json({
        message:
          "Movie removed from watchlist",

        watchlist:
          user.watchlist,
      });
    } catch (error) {
      console.error(
        "Remove watchlist error:",
        error.message
      );

      res.status(500).json({
        message:
          "Could not remove movie",
      });
    }
  }
);

// ==========================================
// CONNECT TO MONGODB
// ==========================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(
      "MongoDB connected successfully!"
    );

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
  });