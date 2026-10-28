import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Search,
  Trash2,
  Send,
  X,
} from "lucide-react";

import { MOVIES } from "../data";

const API = "http://localhost:5000";

const TABS = ["Trending", "Discussions", "Reviews", "Following"];


// =====================================================
// POST CARD
// =====================================================

function Post({ post, index, currentUser, onRefresh }) {
  const [liked, setLiked] = useState(
    post.likes?.some(
      (id) =>
        String(id) ===
        String(currentUser?._id || currentUser?.id)
    ) || false
  );

  const [likeCount, setLikeCount] = useState(
    post.likes?.length || 0
  );

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(
    post.comments || []
  );

  const [loadingComment, setLoadingComment] =
    useState(false);

  const [deleting, setDeleting] = useState(false);

  const movie = MOVIES.find(
    (m) => String(m.id) === String(post.movieId)
  );

  const token = localStorage.getItem("cs_token");

  const isOwner =
    String(post.userId) ===
    String(currentUser?._id || currentUser?.id);


  // ===================================================
  // LIKE / UNLIKE
  // ===================================================

  const handleLike = async () => {
    try {
      const response = await fetch(
        `${API}/api/community/${post._id}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not like post"
        );
      }

      setLiked(data.liked);
      setLikeCount(data.likes);
    } catch (error) {
      console.error("Like error:", error);
    }
  };


  // ===================================================
  // ADD COMMENT
  // ===================================================

  const handleComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    try {
      setLoadingComment(true);

      const response = await fetch(
        `${API}/api/community/${post._id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: commentText.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not add comment"
        );
      }

      setComments(data.comments || []);
      setCommentText("");
    } catch (error) {
      console.error("Comment error:", error);
    } finally {
      setLoadingComment(false);
    }
  };


  // ===================================================
  // DELETE POST
  // ===================================================

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `${API}/api/community/${post._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not delete post"
        );
      }

      onRefresh();
    } catch (error) {
      console.error("Delete post error:", error);
      alert(error.message);
    } finally {
      setDeleting(false);
    }
  };


  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass p-4"
    >

      {/* USER HEADER */}

      <header className="flex items-center gap-3 text-sm">

        <span
          aria-hidden
          className="w-9 h-9 rounded-full bg-gradient-to-br from-pink to-cyan grid place-items-center text-ink font-semibold"
        >
          {post.userName?.[0]?.toUpperCase() || "U"}
        </span>

        <div className="flex-1">

          <div className="font-medium text-white">
            {post.userName}
          </div>

          <div className="text-xs text-slate-500">
            {post.createdAt
              ? new Date(
                  post.createdAt
                ).toLocaleString()
              : "Just now"}
          </div>

        </div>


        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-slate-500 hover:text-red-400 transition"
            title="Delete post"
          >
            <Trash2 size={16} />
          </button>
        )}

      </header>


      {/* MOVIE */}

      <div className="mt-4 flex items-center gap-3">

        {post.moviePoster ? (
          <img
            src={post.moviePoster}
            alt={post.movieTitle}
            className="w-12 h-16 object-cover rounded"
          />
        ) : movie?.art ? (
          <div
            style={{
              background: movie.art,
            }}
            className="w-12 h-16 rounded"
          />
        ) : (
          <div className="w-12 h-16 rounded bg-white/10" />
        )}

        <div>

          <div className="text-xs text-slate-500">
            Discussing
          </div>

          <div className="font-display text-cyan">
            {post.movieTitle}
          </div>

        </div>

      </div>


      {/* POST CONTENT */}

      <div className="mt-4">

        {post.isSpoiler ? (
          <details>

            <summary className="cursor-pointer text-pink text-sm">
              ⚠️ Spoiler — click to reveal
            </summary>

            <p className="mt-3 text-slate-200">
              “{post.content}”
            </p>

          </details>
        ) : (
          <p className="text-slate-200">
            “{post.content}”
          </p>
        )}

      </div>


      {/* ACTIONS */}

      <footer className="mt-4 flex justify-between text-sm">

        <div className="flex gap-5">

          <button
            aria-pressed={liked}
            onClick={handleLike}
            className="flex gap-1.5 items-center hover:text-pink transition"
          >

            <motion.span
              key={String(liked)}
              animate={
                liked
                  ? {
                      scale: [1, 1.4, 1],
                    }
                  : {}
              }
            >
              <Heart
                size={17}
                className={
                  liked
                    ? "fill-pink text-pink"
                    : ""
                }
              />
            </motion.span>

            {likeCount}

          </button>


          <button
            onClick={() =>
              setShowComments(!showComments)
            }
            className="flex gap-1.5 items-center text-slate-400 hover:text-white transition"
          >
            <MessageCircle size={17} />
            {comments.length}
          </button>

        </div>


        <button
          className="text-slate-500 hover:text-cyan transition"
          title="Bookmark"
        >
          <Bookmark size={17} />
        </button>

      </footer>


      {/* COMMENTS */}

      {showComments && (
        <div className="mt-4 pt-4 border-t border-white/10">

          <div className="space-y-3 max-h-60 overflow-y-auto">

            {comments.length === 0 ? (
              <p className="text-xs text-slate-500">
                No comments yet. Start the conversation.
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="flex gap-2"
                >

                  <div className="w-7 h-7 rounded-full bg-white/10 grid place-items-center text-xs">
                    {comment.userName?.[0]?.toUpperCase()}
                  </div>

                  <div className="flex-1">

                    <div className="text-xs text-slate-400">
                      {comment.userName}
                    </div>

                    <div className="text-sm text-slate-200">
                      {comment.text}
                    </div>

                  </div>

                </div>
              ))
            )}

          </div>


          <form
            onSubmit={handleComment}
            className="mt-4 flex gap-2"
          >

            <input
              value={commentText}
              onChange={(e) =>
                setCommentText(e.target.value)
              }
              placeholder="Write a comment..."
              maxLength={500}
              className="field flex-1"
            />

            <button
              type="submit"
              disabled={
                loadingComment ||
                !commentText.trim()
              }
              className="btn px-3"
            >
              <Send size={15} />
            </button>

          </form>

        </div>
      )}

    </motion.article>
  );
}


// =====================================================
// COMMUNITY PAGE
// =====================================================

export default function Community() {

  const [tab, setTab] = useState("Trending");

  const [q, setQ] = useState("");

  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [showCreate, setShowCreate] = useState(false);

  const [txt, setTxt] = useState("");

  const [isSpoiler, setIsSpoiler] = useState(false);


  // ===================================================
  // REAL TMDB MOVIE SEARCH
  // ===================================================

  const [movieSearch, setMovieSearch] = useState("");

  const [movieResults, setMovieResults] = useState([]);

  const [selectedMovie, setSelectedMovie] =
    useState(null);

  const [movieLoading, setMovieLoading] =
    useState(false);


  const [posting, setPosting] = useState(false);

  const token = localStorage.getItem("cs_token");


  const currentUser = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("cs_user") || "null"
      );
    } catch {
      return null;
    }
  }, []);


  // ===================================================
  // FETCH COMMUNITY POSTS
  // ===================================================

  const fetchPosts = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        `${API}/api/community`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Could not load community"
        );
      }

      setPosts(data.posts || []);

    } catch (error) {

      console.error(
        "Community fetch error:",
        error
      );

      setError(error.message);

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    fetchPosts();
  }, []);


  // ===================================================
  // SEARCH REAL MOVIES FROM TMDB
  // ===================================================

  const searchMovies = async (query) => {

    setMovieSearch(query);

    // Clear results if search is too short
    if (query.trim().length < 2) {
      setMovieResults([]);
      return;
    }

    try {

      setMovieLoading(true);

      const response = await fetch(
        `${API}/api/movies?search=${encodeURIComponent(
          query.trim()
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Movie search failed"
        );
      }

      setMovieResults(data.movies || []);

    } catch (error) {

      console.error(
        "Movie search error:",
        error
      );

      setMovieResults([]);

    } finally {

      setMovieLoading(false);

    }
  };


  // ===================================================
  // CREATE POST
  // ===================================================

  const addPost = async (e) => {

    e.preventDefault();

    if (!txt.trim()) {
      alert("Please write something.");
      return;
    }

    if (!selectedMovie) {
      alert(
        "Please search and select a movie first."
      );
      return;
    }

    try {

      setPosting(true);

      const response = await fetch(
        `${API}/api/community`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            movieId: String(
              selectedMovie.id
            ),

            movieTitle:
              selectedMovie.title,

            moviePoster:
              selectedMovie.poster || "",

            content:
              txt.trim(),

            isSpoiler,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Could not create post"
        );
      }

      // Reset form

      setTxt("");

      setIsSpoiler(false);

      setMovieSearch("");

      setMovieResults([]);

      setSelectedMovie(null);

      setShowCreate(false);

      await fetchPosts();

    } catch (error) {

      console.error(
        "Create post error:",
        error
      );

      alert(error.message);

    } finally {

      setPosting(false);

    }
  };


  // ===================================================
  // FILTER POSTS
  // ===================================================

  const list = posts.filter((post) => {

    const searchText =
      `${post.movieTitle || ""} ${
        post.content || ""
      } ${post.userName || ""}`.toLowerCase();

    return searchText.includes(
      q.toLowerCase()
    );
  });


  return (
    <section>

      {/* HEADER */}

      <div className="flex flex-wrap justify-between gap-4 items-end">

        <div>

          <h1 className="font-display text-3xl text-cyan">
            Community
          </h1>

          <p className="text-slate-400 text-sm">
            What’s playing in everyone’s mind?
          </p>

        </div>


        <div className="flex gap-3">

          <div className="relative">

            <Search
              size={15}
              className="absolute left-3 top-3.5 text-slate-500"
            />

            <input
              aria-label="Search posts"
              value={q}
              onChange={(e) =>
                setQ(e.target.value)
              }
              placeholder="Search posts or people"
              className="field pl-9 w-64"
            />

          </div>


          <button
            onClick={() =>
              setShowCreate(true)
            }
            className="btn"
          >
            + POST
          </button>

        </div>

      </div>


      {/* TABS */}

      <div
        role="tablist"
        className="mt-6 flex gap-6 text-sm border-b border-white/10"
      >

        {TABS.map((t) => (

          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`pb-2 relative ${
              tab === t
                ? "text-white"
                : "text-slate-500"
            }`}
          >

            {t}

            {tab === t && (
              <motion.span
                layoutId="ct"
                className="absolute inset-x-0 -bottom-px h-px bg-pink"
              />
            )}

          </button>

        ))}

      </div>


      {/* MAIN */}

      <div className="mt-6 grid lg:grid-cols-[1fr_280px] gap-6">

        <div className="space-y-5">

          {loading && (
            <div className="glass p-8 text-center text-slate-400">
              Loading community...
            </div>
          )}


          {!loading && error && (
            <div className="glass p-8 text-center">

              <p className="text-red-400">
                {error}
              </p>

              <button
                onClick={fetchPosts}
                className="btn mt-4"
              >
                Retry
              </button>

            </div>
          )}


          {!loading &&
            !error &&
            list.length > 0 && (

              <div className="grid md:grid-cols-2 gap-5">

                {list.map(
                  (post, index) => (
                    <Post
                      key={post._id}
                      post={post}
                      index={index}
                      currentUser={currentUser}
                      onRefresh={fetchPosts}
                    />
                  )
                )}

              </div>

            )}


          {!loading &&
            !error &&
            list.length === 0 && (

              <div className="glass p-10 text-center">

                <MessageCircle
                  size={30}
                  className="mx-auto text-slate-600 mb-3"
                />

                <p className="text-slate-400">
                  No posts here yet.
                </p>

                <p className="text-slate-600 text-sm mt-1">
                  Start the conversation.
                </p>

                <button
                  onClick={() =>
                    setShowCreate(true)
                  }
                  className="btn mt-5"
                >
                  Create First Post
                </button>

              </div>

            )}

        </div>


        {/* COMMUNITY STATS */}

        <aside className="glass p-4 h-fit">

          <h2 className="text-sm mb-3">
            Community Stats
          </h2>

          <div className="space-y-4">

            <div>

              <div className="text-2xl font-display text-cyan">
                {posts.length}
              </div>

              <div className="text-xs text-slate-500">
                Total discussions
              </div>

            </div>


            <div>

              <div className="text-2xl font-display text-pink">
                {posts.reduce(
                  (total, post) =>
                    total +
                    (post.likes?.length || 0),
                  0
                )}
              </div>

              <div className="text-xs text-slate-500">
                Total likes
              </div>

            </div>


            <div>

              <div className="text-2xl font-display">
                {posts.reduce(
                  (total, post) =>
                    total +
                    (post.comments?.length || 0),
                  0
                )}
              </div>

              <div className="text-xs text-slate-500">
                Total comments
              </div>

            </div>

          </div>

        </aside>

      </div>


      {/* ================================================= */}
      {/* CREATE POST MODAL */}
      {/* ================================================= */}

      {showCreate && (

        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4">

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            className="glass w-full max-w-lg p-6"
          >

            {/* MODAL HEADER */}

            <div className="flex justify-between items-center mb-5">

              <div>

                <h2 className="font-display text-xl text-cyan">
                  Create Post
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Start a conversation about a movie.
                </p>

              </div>

              <button
                onClick={() => {
                  setShowCreate(false);
                  setMovieSearch("");
                  setMovieResults([]);
                  setSelectedMovie(null);
                }}
                className="text-slate-500 hover:text-white"
              >
                <X size={20} />
              </button>

            </div>


            {/* MOVIE SEARCH */}

            <label className="text-xs text-slate-400">
              Movie
            </label>

            <div className="relative mt-2">

              <Search
                size={15}
                className="absolute left-3 top-3.5 text-slate-500"
              />

              <input
                type="text"
                value={movieSearch}
                onChange={(e) =>
                  searchMovies(e.target.value)
                }
                placeholder="Search any movie..."
                className="field w-full pl-9"
              />


              {movieLoading && (
                <div className="absolute right-3 top-3 text-xs text-slate-500">
                  Searching...
                </div>
              )}


              {/* TMDB SEARCH RESULTS */}

              {movieResults.length > 0 && (
                <div className="absolute z-50 left-0 right-0 mt-2 max-h-72 overflow-y-auto glass border border-white/10 shadow-2xl">

                  {movieResults.map(
                    (movie) => (

                      <button
                        type="button"
                        key={movie.id}
                        onClick={() => {

                          setSelectedMovie(
                            movie
                          );

                          setMovieSearch(
                            movie.title
                          );

                          setMovieResults(
                            []
                          );
                        }}
                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/10 transition border-b border-white/5 last:border-0"
                      >

                        {/* POSTER */}

                        {movie.poster ? (
                          <img
                            src={movie.poster}
                            alt={
                              movie.title
                            }
                            className="w-10 h-14 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-14 rounded bg-white/10 grid place-items-center text-xs text-slate-600">
                            N/A
                          </div>
                        )}


                        {/* DETAILS */}

                        <div className="min-w-0">

                          <div className="text-sm text-white truncate">
                            {movie.title}
                          </div>

                          <div className="text-xs text-slate-500 mt-1">
                            {movie.year ||
                              "Year unavailable"}
                          </div>

                          {movie.rating !==
                            undefined && (
                            <div className="text-xs text-cyan mt-1">
                              ★{" "}
                              {Number(
                                movie.rating
                              ).toFixed(1)}
                            </div>
                          )}

                        </div>

                      </button>

                    )
                  )}

                </div>
              )}


              {/* NO RESULTS */}

              {!movieLoading &&
                movieSearch.trim().length >=
                  2 &&
                movieResults.length === 0 &&
                !selectedMovie && (

                  <div className="absolute z-40 left-0 right-0 mt-2 glass p-4 text-xs text-slate-500">
                    No movies found.
                  </div>

                )}

            </div>


            {/* SELECTED MOVIE */}

            {selectedMovie && (
              <div className="mt-3 flex items-center gap-3 p-3 rounded border border-cyan/20 bg-cyan/5">

                {selectedMovie.poster ? (
                  <img
                    src={selectedMovie.poster}
                    alt={
                      selectedMovie.title
                    }
                    className="w-12 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-16 rounded bg-white/10" />
                )}

                <div className="flex-1">

                  <div className="text-xs text-slate-500">
                    Selected movie
                  </div>

                  <div className="text-sm text-cyan font-medium">
                    {selectedMovie.title}
                  </div>

                  <div className="text-xs text-slate-500 mt-1">
                    {selectedMovie.year ||
                      "Year unavailable"}
                  </div>

                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedMovie(null);
                    setMovieSearch("");
                  }}
                  className="text-slate-500 hover:text-red-400"
                  title="Change movie"
                >
                  <X size={16} />
                </button>

              </div>
            )}


            {/* POST CONTENT */}

            <textarea
              value={txt}
              onChange={(e) =>
                setTxt(e.target.value)
              }
              placeholder="What do you think about this movie?"
              maxLength={1000}
              rows={5}
              className="field w-full mt-4 resize-none"
            />


            {/* SPOILER */}

            <label className="flex items-center gap-2 mt-4 text-sm text-slate-400 cursor-pointer">

              <input
                type="checkbox"
                checked={isSpoiler}
                onChange={(e) =>
                  setIsSpoiler(
                    e.target.checked
                  )
                }
              />

              Mark as spoiler

            </label>


            {/* ACTIONS */}

            <div className="flex justify-end gap-3 mt-5">

              <button
                type="button"
                onClick={() => {
                  setShowCreate(false);
                  setMovieSearch("");
                  setMovieResults([]);
                  setSelectedMovie(null);
                  setTxt("");
                  setIsSpoiler(false);
                }}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={addPost}
                disabled={
                  posting ||
                  !txt.trim() ||
                  !selectedMovie
                }
                className="btn"
              >
                {posting
                  ? "POSTING..."
                  : "POST"}
              </button>

            </div>

          </motion.div>

        </div>

      )}

    </section>
  );
}
