const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
const PORT = 5000;

// Verify authentication token
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Authentication token required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}
// Middleware
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("CineSphere Backend is running!");
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "CineSphere API is working!"
  });
});
console.log("MOVIES TEST ROUTE REGISTERED");

app.get("/api/movies-test", (req, res) => {
  console.log("MOVIES TEST REQUEST RECEIVED");

  res.json({
    message: "Movies route is working!"
  });
});

app.get("/api/movies", async (req, res) => {

  console.log("MOVIES ROUTE HIT");
  return res.json({ test: "MOVIES ROUTE WORKS" });

  console.log("ACTUAL MOVIES ROUTE REGISTERED");
  console.log("MOVIES REQUEST RECEIVED");
try {
if (!process.env.TMDB_API_KEY) {
return res.status(500).json({
message: "TMDB_API_KEY is missing in backend/.env",
});
}


const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);

const params = new URLSearchParams({
  api_key: process.env.TMDB_API_KEY,
  language: "en-US",
  page: String(page),
});

const response = await fetch(
  `https://api.themoviedb.org/3/movie/popular?${params}`
);

if (!response.ok) {
  console.error("TMDB error status:", response.status);
  return res.status(502).json({
    message: "TMDB could not provide movies. Check the API credentials.",
  });
}

const data = await response.json();

const movies = data.results.map((movie) => ({
  id: movie.id,
  title: movie.title,
  year: movie.release_date ? movie.release_date.slice(0, 4) : "N/A",
  rating: movie.vote_average,
  overview: movie.overview,
  poster: movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null,
  genreIds: movie.genre_ids,
}));

res.json({
  page: data.page,
  totalPages: data.total_pages,
  totalResults: data.total_results,
  movies,
});


} catch (error) {
console.error("TMDB fetch error:", error.message);


res.status(500).json({
  message: "Server error while fetching movies",
});


}
});

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
    console.error("Signup error:", error.message);

    res.status(500).json({
      message: "Server error during signup"
    });
  }
});
// Login API
app.get("/api/auth/login-test", (req, res) => {
  res.json({
    message: "Login route area is working!"
  });
});
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
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
    console.error("Login error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// Get the currently logged-in user
app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

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
    console.error("Get user error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// GET: Fetch the logged-in user's watchlist
app.get("/api/watchlist", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("watchlist");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      watchlist: user.watchlist,
    });
  } catch (error) {
    console.error("Fetch watchlist error:", error.message);

    res.status(500).json({
      message: "Could not fetch watchlist",
    });
  }
});

// POST: Add a movie to the watchlist
app.post("/api/watchlist/:movieId", authenticateToken, async (req, res) => {
  try {
    const movieId = String(req.params.movieId);

    if (!movieId.trim()) {
      return res.status(400).json({
        message: "Movie ID is required",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.watchlist.includes(movieId)) {
      user.watchlist.push(movieId);
      await user.save();
    }

    res.json({
      message: "Movie added to watchlist",
      watchlist: user.watchlist,
    });
  } catch (error) {
    console.error("Add watchlist error:", error.message);

    res.status(500).json({
      message: "Could not add movie",
    });
  }
});

// DELETE: Remove a movie from the watchlist
app.delete(
  "/api/watchlist/:movieId",
  authenticateToken,
  async (req, res) => {
    try {
      const movieId = String(req.params.movieId);
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.watchlist = user.watchlist.filter(
        (id) => id !== movieId
      );

      await user.save();

      res.json({
        message: "Movie removed from watchlist",
        watchlist: user.watchlist,
      });
    } catch (error) {
      console.error("Remove watchlist error:", error.message);

      res.status(500).json({
        message: "Could not remove movie",
      });
    }
  }
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
