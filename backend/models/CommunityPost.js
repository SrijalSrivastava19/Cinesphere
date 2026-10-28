const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userName: {
      type: String,
      required: true,
      trim: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

const communityPostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userName: {
      type: String,
      required: true,
      trim: true,
    },

    movieId: {
      type: String,
      required: true,
    },

    movieTitle: {
      type: String,
      required: true,
      trim: true,
    },

    moviePoster: {
      type: String,
      default: "",
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    isSpoiler: {
      type: Boolean,
      default: false,
    },

    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },

    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const CommunityPost = mongoose.model(
  "CommunityPost",
  communityPostSchema
);

module.exports = CommunityPost;