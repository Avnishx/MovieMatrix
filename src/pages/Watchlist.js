import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);

  const fetchWatchlist = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    try {
      const watchlistRef = collection(db, "users", user.uid, "watchlist");
      let q;
      try {
        q = query(watchlistRef, orderBy("createdAt", "desc"));
      } catch (err) {
        q = watchlistRef; // Fallback if error
      }

      const snapshot = await getDocs(q);
      const movies = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setWatchlist(movies);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      toast.error("Failed to load watchlist.");
    }
  };

  const removeFromWatchlist = async (movieId, e) => {
    e.stopPropagation(); // Prevent any residual event bubbling
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "watchlist", movieId.toString()));
      setWatchlist((prev) => prev.filter((movie) => movie.id !== movieId));
      toast.success("Removed from Watchlist ✅");
    } catch (error) {
      console.error("Error removing movie:", error);
      toast.error("Failed to remove movie.");
    }
  };

  const toggleWatchedStatus = async (movieId, currentWatched, e) => {
    e.stopPropagation(); // Prevent Link navigation
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    try {
      const movieRef = doc(db, "users", user.uid, "watchlist", movieId.toString());
      await updateDoc(movieRef, {
        watched: !currentWatched,
      });

      setWatchlist((prev) =>
        prev.map((movie) =>
          movie.id === movieId ? { ...movie, watched: !currentWatched } : movie
        )
      );

      toast.success(`Marked as ${!currentWatched ? "watched" : "unwatched"}!`);
    } catch (error) {
      console.error("Error updating watched status:", error);
      toast.error("Failed to update watched status.");
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  return (
    <div className="p-4 mt-20">
      <h1 className="text-2xl font-bold mb-4 text-white">🎬 My Watchlist</h1>
      {watchlist.length === 0 ? (
        <p className="text-gray-400">No movies in your watchlist yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {watchlist.map((movie) => (
            <div
              key={movie.id}
              className="bg-gray-800 rounded p-2 text-white shadow hover:scale-105 transition-all duration-300 min-w-[150px] relative"
            >
              <button
                onClick={(e) => removeFromWatchlist(movie.id, e)}
                className="absolute top-2 right-2 text-red-600 text-xl hover:bg-pink-500 hover:text-white transition duration-200 bg-gray-900 bg-opacity-90 rounded-full p-1.5 shadow-sm z-10"
              >
                <IoClose />
              </button>
              <Link to={`/${movie.media_type || "movie"}/${movie.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title || movie.name}
                  className="rounded mb-2 cursor-pointer"
                />
                <h2 className="font-semibold text-center text-base truncate cursor-pointer leading-tight">
                  {movie.title || movie.name}
                </h2>
              </Link>

              <div className="flex items-center justify-center mt-3">
                <label className="flex items-center space-x-2 text-sm font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-green-500 w-4 h-4 transition-transform duration-200 checked:scale-110"
                    checked={movie.watched || false}
                    onChange={(e) => toggleWatchedStatus(movie.id, movie.watched, e)}
                  />
                  <span>Watched</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Watchlist;