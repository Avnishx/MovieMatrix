import { getAuth } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-hot-toast";

const addToWatchlist = async (movie) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    toast.error("Please login to add to your Watchlist.", {
      duration: 4000,
      style: {
        minWidth: '260px',
        borderRadius: '12px',
        background: 'linear-gradient(to right, #0f0c29, #302b63, #24243e)',
        color: '#39ff14',
        padding: '14px 18px',
        fontWeight: 'bold',
        border: '2px solid rgb(1, 0, 0)',
        boxShadow: '0 0 10px rgb(213, 249, 33)',
      },
      iconTheme: {
        primary: '#ff3860',
        secondary: '#0f0c29',
      },
    });
    return;
  }

  try {
    await setDoc(doc(db, "users", user.uid, "watchlist", movie.id.toString()), {
      ...movie,
      createdAt: serverTimestamp()  // ✅ added timestamp here bro
    });

    const movieTitle = movie.title || movie.name || "Movie";
    toast.success(`${movieTitle} added to your Watchlist! 🔥`, {
      duration: 4000,
      style: {
        minWidth: '260px',
        borderRadius: '12px',
        background: 'linear-gradient(to right, #0f0c29, #302b63, #24243e)',
        color: '#39ff14',
        padding: '14px 18px',
        fontWeight: 'bold',
        border: '2px solid rgb(1, 0, 0)',
        boxShadow: '0 0 10px rgb(213, 249, 33)',
      },
      iconTheme: {
        primary: '#39ff14',
        secondary: '#0f0c29',
      },
    });

  } catch (error) {
    console.error("Error adding to watchlist:", error);
  }
};

export default addToWatchlist;
