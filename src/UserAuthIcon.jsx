import { UserCircle, LogOut, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function UserAuthIcon({ user, handleGoogleLogin, logout }) {
  const [open, setOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset imageError whenever user.photoURL changes
  useEffect(() => {
    setImageError(false);
  }, [user?.photoURL]);

  const getInitial = () => {
    return user?.displayName
      ? user.displayName.charAt(0).toUpperCase()
      : user?.email
      ? user.email.charAt(0).toUpperCase()
      : "?";
  };

  return (
    <div className="relative">
      {user ? (
        <div>
          <div
            onClick={() => setOpen(!open)}
            className="relative w-10 h-10 bg-red-500 text-white rounded-full cursor-pointer overflow-hidden flex items-center justify-center"
          >
            {user.photoURL && !imageError ? (
              <img
                src={user.photoURL}
                alt=""
                onError={() => setImageError(true)}
                className="absolute w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-lg flex items-center justify-center w-full h-full">
                {getInitial()}
              </span>
            )}
          </div>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-black text-white rounded-lg shadow-lg overflow-hidden z-50">
              <Link
                to="/watchlist"
                className="flex items-center gap-2 p-2 hover:bg-gray-800 w-full text-left"
                onClick={() => setOpen(false)}
              >
                <Star size={18} />
                Watchlist
              </Link>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="flex items-center gap-2 p-2 hover:bg-gray-800 w-full text-left"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={handleGoogleLogin}
          className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center cursor-pointer"
        >
          <UserCircle size={24} />
        </div>
      )}
    </div>
  );
}

export default UserAuthIcon;
