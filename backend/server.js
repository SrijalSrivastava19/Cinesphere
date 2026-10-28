const CommunityPost = require("./models/CommunityPost");
const Review = require("./models/Review");
const Sentiment = require("sentiment");
const sentimentAnalyzer = new Sentiment();
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
        message: "TMDB_API_KEY is missing in backend/.env",
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

app.get("/api/movies/:movieId", async (req, res) => {
  console.log(
    `MOVIE DETAILS REQUEST: ${req.params.movieId}`
  );

  try {
    if (!process.env.TMDB_API_KEY) {
      return res.status(500).json({
        message: "TMDB_API_KEY is missing in backend/.env",
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
        (person) => person.job === "Director"
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
// FAVORITES - GET
// ==========================================

app.get(
  "/api/favorites",
  authenticateToken,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.userId
        ).select("favorites");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json({
        favorites: user.favorites,
      });
    } catch (error) {
      console.error(
        "Fetch favorites error:",
        error.message
      );

      res.status(500).json({
        message:
          "Could not fetch favorites",
      });
    }
  }
);

// ==========================================
// FAVORITES - ADD
// ==========================================

app.post(
  "/api/favorites/:movieId",
  authenticateToken,
  async (req, res) => {
    try {
      const movieId =
        String(req.params.movieId).trim();

      if (!movieId) {
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
        !user.favorites.includes(movieId)
      ) {
        user.favorites.push(movieId);

        await user.save();
      }

      res.json({
        message:
          "Movie added to favorites",

        favorites:
          user.favorites,
      });
    } catch (error) {
      console.error(
        "Add favorite error:",
        error.message
      );

      res.status(500).json({
        message:
          "Could not add movie to favorites",
      });
    }
  }
);

// ==========================================
// FAVORITES - REMOVE
// ==========================================

app.delete(
  "/api/favorites/:movieId",
  authenticateToken,
  async (req, res) => {
    try {
      const movieId =
        String(req.params.movieId).trim();

      if (!movieId) {
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

      user.favorites =
        user.favorites.filter(
          (id) => id !== movieId
        );

      await user.save();

      res.json({
        message:
          "Movie removed from favorites",

        favorites:
          user.favorites,
      });
    } catch (error) {
      console.error(
        "Remove favorite error:",
        error.message
      );

      res.status(500).json({
        message:
          "Could not remove movie from favorites",
      });
    }
  }
);


// ==========================================
// COMMUNITY - GET POSTS
// ==========================================

app.get(
  "/api/community",
  authenticateToken,
  async (req, res) => {
    try {
      const posts = await CommunityPost.find()
        .sort({ createdAt: -1 })
        .limit(50);

      res.json({
        posts,
      });
    } catch (error) {
      console.error(
        "Fetch community posts error:",
        error.message
      );

      res.status(500).json({
        message: "Could not fetch community posts",
      });
    }
  }
);

// ==========================================
// COMMUNITY - CREATE POST
// ==========================================

app.post(
  "/api/community",
  authenticateToken,
  async (req, res) => {
    try {
      const {
        movieId,
        movieTitle,
        moviePoster,
        content,
        isSpoiler,
      } = req.body;

      if (
        !movieId ||
        !movieTitle ||
        !content
      ) {
        return res.status(400).json({
          message:
            "Movie ID, movie title and content are required",
        });
      }

      const user = await User.findById(
        req.userId
      );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const post = new CommunityPost({
        userId: user._id,
        userName: user.name,

        movieId: String(movieId),

        movieTitle,

        moviePoster: moviePoster || "",

        content,

        isSpoiler: Boolean(isSpoiler),
      });

      await post.save();

      res.status(201).json({
        message: "Post created successfully",
        post,
      });
    } catch (error) {
      console.error(
        "Create community post error:",
        error.message
      );

      res.status(500).json({
        message:
          "Could not create community post",
      });
    }
  }
);

// ==========================================
// COMMUNITY - LIKE / UNLIKE POST
// ==========================================

app.post(
  "/api/community/:postId/like",
  authenticateToken,
  async (req, res) => {
    try {
      const post =
        await CommunityPost.findById(
          req.params.postId
        );

      if (!post) {
        return res.status(404).json({
          message: "Post not found",
        });
      }

      const userId = String(req.userId);

      const alreadyLiked =
        post.likes.some(
          (id) =>
            String(id) === userId
        );

      if (alreadyLiked) {
        post.likes =
          post.likes.filter(
            (id) =>
              String(id) !== userId
          );
      } else {
        post.likes.push(req.userId);
      }

      await post.save();

      res.json({
        message: alreadyLiked
          ? "Post unliked"
          : "Post liked",

        likes: post.likes.length,

        liked: !alreadyLiked,
      });
    } catch (error) {
      console.error(
        "Like post error:",
        error.message
      );

      res.status(500).json({
        message: "Could not like post",
      });
    }
  }
);

// ==========================================
// COMMUNITY - ADD COMMENT
// ==========================================

app.post(
  "/api/community/:postId/comments",
  authenticateToken,
  async (req, res) => {
    try {
      const { text } = req.body;

      if (!text || !text.trim()) {
        return res.status(400).json({
          message: "Comment cannot be empty",
        });
      }

      const post =
        await CommunityPost.findById(
          req.params.postId
        );

      if (!post) {
        return res.status(404).json({
          message: "Post not found",
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

      post.comments.push({
        userId: user._id,
        userName: user.name,
        text: text.trim(),
      });

      await post.save();

      res.status(201).json({
        message: "Comment added successfully",

        comments: post.comments,
      });
    } catch (error) {
      console.error(
        "Add comment error:",
        error.message
      );

      res.status(500).json({
        message: "Could not add comment",
      });
    }
  }
);

// ==========================================
// COMMUNITY - DELETE POST
// ==========================================

app.delete(
  "/api/community/:postId",
  authenticateToken,
  async (req, res) => {
    try {
      const post =
        await CommunityPost.findById(
          req.params.postId
        );

      if (!post) {
        return res.status(404).json({
          message: "Post not found",
        });
      }

      if (
        String(post.userId) !==
        String(req.userId)
      ) {
        return res.status(403).json({
          message:
            "You can only delete your own posts",
        });
      }

      await CommunityPost.findByIdAndDelete(
        req.params.postId
      );

      res.json({
        message: "Post deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete community post error:",
        error.message
      );

      res.status(500).json({
        message: "Could not delete post",
      });
    }
  }
);


// ==========================================
// REVIEWS - GET MOVIE REVIEWS
// ==========================================

app.get(
  "/api/reviews/:movieId",
  authenticateToken,
  async (req, res) => {
    try {
      const movieId = String(req.params.movieId).trim();

      if (!movieId) {
        return res.status(400).json({
          message: "Movie ID is required",
        });
      }

      const reviews = await Review.find({ movieId })
        .sort({ createdAt: -1 })
        .limit(100);

      const totalReviews = reviews.length;

      const averageRating =
        totalReviews > 0
          ? Number(
              (
                reviews.reduce(
                  (sum, review) => sum + review.rating,
                  0
                ) / totalReviews
              ).toFixed(1)
            )
          : 0;

      res.json({
        movieId,
        reviews,
        totalReviews,
        averageRating,
      });
    } catch (error) {
      console.error(
        "Fetch reviews error:",
        error.message
      );

      res.status(500).json({
        message: "Could not fetch reviews",
      });
    }
  }
);


// ==========================================
// REVIEWS - CREATE REVIEW
// ==========================================

app.post(
  "/api/reviews",
  authenticateToken,
  async (req, res) => {
    try {
      const {
        movieId,
        movieTitle,
        rating,
        text,
      } = req.body;

      if (
        !movieId ||
        !movieTitle ||
        rating === undefined ||
        !text ||
        !text.trim()
      ) {
        return res.status(400).json({
          message:
            "Movie ID, movie title, rating and review text are required",
        });
      }

      const numericRating = Number(rating);

      if (
        !Number.isFinite(numericRating) ||
        numericRating < 1 ||
        numericRating > 10
      ) {
        return res.status(400).json({
          message: "Rating must be between 1 and 10",
        });
      }

      if (text.trim().length > 2000) {
        return res.status(400).json({
          message:
            "Review cannot exceed 2000 characters",
        });
      }

      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Prevent duplicate review for the same movie
      const existingReview = await Review.findOne({
        userId: user._id,
        movieId: String(movieId),
      });

      if (existingReview) {
        return res.status(409).json({
          message:
            "You have already reviewed this movie",
        });
      }

    const sentimentResult =
  sentimentAnalyzer.analyze(text.trim());

let sentiment = "neutral";

if (sentimentResult.comparative >= 0.05) {
  sentiment = "positive";
} else if (sentimentResult.comparative <= -0.05) {
  sentiment = "negative";
}

const sentimentScore = Math.max(
  -1,
  Math.min(1, sentimentResult.comparative)
);

const review = new Review({
  userId: user._id,
  userName: user.name,
  movieId: String(movieId),
  movieTitle: movieTitle.trim(),
  rating: numericRating,
  text: text.trim(),
  sentiment,
  sentimentScore,
});

await review.save();

      

      res.status(201).json({
        message: "Review created successfully",
        review,
      });
    } catch (error) {
      console.error(
        "Create review error:",
        error.message
      );

      res.status(500).json({
        message: "Could not create review",
      });
    }
  }
);


// ==========================================
// REVIEWS - DELETE REVIEW
// ==========================================

app.delete(
  "/api/reviews/:reviewId",
  authenticateToken,
  async (req, res) => {
    try {
      const review =
        await Review.findById(
          req.params.reviewId
        );

      if (!review) {
        return res.status(404).json({
          message: "Review not found",
        });
      }

      if (
        String(review.userId) !==
        String(req.userId)
      ) {
        return res.status(403).json({
          message:
            "You can only delete your own review",
        });
      }

      await Review.findByIdAndDelete(
        req.params.reviewId
      );

      res.json({
        message: "Review deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete review error:",
        error.message
      );

      res.status(500).json({
        message: "Could not delete review",
      });
    }
  }
);

// ==========================================
// REVIEWS - SENTIMENT SUMMARY
// ==========================================

app.get(
  "/api/reviews/:movieId/sentiment",
  authenticateToken,
  async (req, res) => {
    try {
      const movieId = String(req.params.movieId).trim();

      if (!movieId) {
        return res.status(400).json({
          message: "Movie ID is required",
        });
      }

      const reviews = await Review.find({ movieId });

      const totalReviews = reviews.length;

      if (totalReviews === 0) {
        return res.json({
          movieId,
          totalReviews: 0,
          averageRating: 0,
          positive: 0,
          neutral: 0,
          negative: 0,
          overallSentiment: "No reviews yet",
        });
      }

      const positiveCount = reviews.filter(
        (review) => review.sentiment === "positive"
      ).length;

      const neutralCount = reviews.filter(
        (review) => review.sentiment === "neutral"
      ).length;

      const negativeCount = reviews.filter(
        (review) => review.sentiment === "negative"
      ).length;

      const averageRating = Number(
        (
          reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) / totalReviews
        ).toFixed(1)
      );

      const positivePercentage = Number(
        ((positiveCount / totalReviews) * 100).toFixed(1)
      );

      const neutralPercentage = Number(
        ((neutralCount / totalReviews) * 100).toFixed(1)
      );

      const negativePercentage = Number(
        ((negativeCount / totalReviews) * 100).toFixed(1)
      );

      let overallSentiment = "Mostly Neutral";

      if (
        positiveCount > neutralCount &&
        positiveCount > negativeCount
      ) {
        overallSentiment = "Mostly Positive";
      } else if (
        negativeCount > positiveCount &&
        negativeCount > neutralCount
      ) {
        overallSentiment = "Mostly Negative";
      }

      res.json({
        movieId,
        totalReviews,
        averageRating,

        positive: positivePercentage,
        neutral: neutralPercentage,
        negative: negativePercentage,

        positiveCount,
        neutralCount,
        negativeCount,

        overallSentiment,
      });
    } catch (error) {
      console.error(
        "Sentiment summary error:",
        error.message
      );

      res.status(500).json({
        message: "Could not calculate sentiment summary",
      });
    }
  }
);


// ==========================================
// HYPE METER - GET MOVIE HYPE
// ==========================================

app.get(
  "/api/hype/:movieId",
  authenticateToken,
  async (req, res) => {
    try {
      const movieId = String(req.params.movieId).trim();

      if (!movieId) {
        return res.status(400).json({
          message: "Movie ID is required",
        });
      }

      // ========================================
      // TMDB POPULARITY
      // ========================================

      let tmdbPopularity = 0;

      try {
        const tmdbResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}`
        );

        if (tmdbResponse.ok) {
          const tmdbMovie = await tmdbResponse.json();

          tmdbPopularity =
            Number(tmdbMovie.popularity) || 0;
        }
      } catch (tmdbError) {
        console.error(
          "TMDB hype error:",
          tmdbError.message
        );
      }

      // ========================================
      // WATCHLIST COUNT
      // ========================================

      const watchlistCount =
        await User.countDocuments({
          watchlist: movieId,
        });

      // ========================================
      // FAVORITES COUNT
      // ========================================

      const favoriteCount =
        await User.countDocuments({
          favorites: movieId,
        });

      // ========================================
      // COMMUNITY POSTS
      // ========================================

      const posts =
        await CommunityPost.find({
          movieId,
        }).select("likes comments");

      const postCount = posts.length;

      // ========================================
      // TOTAL LIKES
      // ========================================

      const likeCount = posts.reduce(
        (total, post) =>
          total + (post.likes?.length || 0),
        0
      );

      // ========================================
      // TOTAL COMMENTS
      // ========================================

      const commentCount = posts.reduce(
        (total, post) =>
          total + (post.comments?.length || 0),
        0
      );

      // ========================================
      // TMDB BASE SCORE
      // ========================================
      // TMDB gives every real movie a baseline
      // hype score even before CineSphere users
      // interact with it.

      const tmdbScore = Math.min(
        70,
        Math.round(
          Math.log10(tmdbPopularity + 1) * 35
        )
      );

      // ========================================
      // CINESPHERE COMMUNITY BOOST
      // ========================================
      // User activity adds additional hype.

      const communityBoost = Math.min(
        30,
        favoriteCount * 4 +
          watchlistCount * 2 +
          postCount * 4 +
          likeCount +
          commentCount
      );

      // ========================================
      // FINAL HYPE SCORE
      // ========================================

      const hypeScore = Math.min(
        100,
        tmdbScore + communityBoost
      );

      // ========================================
      // HYPE LEVEL
      // ========================================

      let hypeLevel = "Low";

      if (hypeScore >= 80) {
        hypeLevel = "Explosive";
      } else if (hypeScore >= 60) {
        hypeLevel = "High";
      } else if (hypeScore >= 35) {
        hypeLevel = "Rising";
      }

      // ========================================
      // RESPONSE
      // ========================================

      res.json({
        movieId,

        hypeScore,

        hypeLevel,

        breakdown: {
          tmdbPopularity,
          tmdbScore,
          communityBoost,

          favorites: favoriteCount,
          watchlist: watchlistCount,
          posts: postCount,
          likes: likeCount,
          comments: commentCount,
        },
      });
    } catch (error) {
      console.error(
        "Hype meter error:",
        error.message
      );

      res.status(500).json({
        message:
          "Could not calculate hype score",
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