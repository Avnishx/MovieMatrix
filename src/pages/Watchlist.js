import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-hot-toast";

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);

  const fetchWatchlist = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    try {
      const watchlistRef = collection(db, "users", user.uid, "watchlist");

      // Try fetching with orderBy createdAt
      let q;
      try {
        q = query(watchlistRef, orderBy("createdAt", "desc"));
      } catch (err) {
        q = watchlistRef; // fallback if error
      }

      const snapshot = await getDocs(q);

      const movies = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setWatchlist(movies);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    }
  };

  const removeFromWatchlist = async (movieId) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "watchlist", movieId.toString()));
      setWatchlist((prev) => prev.filter((movie) => movie.id !== movieId));

      toast.success("Removed from Watchlist ✅");
    } catch (error) {
      console.error("Error removing movie:", error);
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
              className="bg-gray-800 rounded p-2 text-white shadow hover:scale-105 transition-all duration-300"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title || movie.name}
                className="rounded mb-2"
              />
              <h2 className="font-semibold text-center text-sm truncate">
                {movie.title || movie.name}
              </h2>

              <div className="flex items-center justify-center space-x-10 mt-3">
                <label className="flex items-center space-x-2 text-sm font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-green-500 w-4 h-4 transition-transform duration-200 checked:scale-110"
                  />
                  <span>Watched</span>
                </label>

                <button
                  onClick={() => removeFromWatchlist(movie.id)}
                  className="text-red-500 text-sm font-bold hover:text-pink-400 transition duration-200"
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Watchlist;
