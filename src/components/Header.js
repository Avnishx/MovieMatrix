import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { IoSearchOutline } from "react-icons/io5";
import { navigation } from '../contants/navigation';
import UserAuthIcon from "../UserAuthIcon";

const Header = ({ user, handleGoogleLogin, logout }) => {
  const location = useLocation();
  const removeSpace = location?.search?.slice(3)?.split("%20")?.join(" ");
  const [searchInput, setSearchInput] = useState(removeSpace || "");
  const navigate = useNavigate();

  useEffect(() => {
    if (searchInput) {
      navigate(`/search?q=${searchInput}`);
    }
  }, [searchInput]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput) {
      navigate(`/search?q=${searchInput}`);
    }
  };

  const handleSearchClick = () => {
    if (searchInput) {
      navigate(`/search?q=${searchInput}`);
    }
  };

  return (
    <header className='fixed top-0 w-full h-16 bg-black bg-opacity-50 z-40'>
      <div className='container mx-auto px-3 flex items-center h-full'>
        <Link to={"/"}>
          <img
            src={logo}
            alt='logo'
            width={180}
          />
        </Link>

        <nav className='hidden lg:flex items-center gap-1 ml-5'>
          {navigation.map((nav, index) => (
            <div key={nav.label + "header" + index}>
              <NavLink
                to={nav.href}
                className={({ isActive }) => `px-2 hover:text-neutral-100 ${isActive && "text-neutral-100"}`}
              >
                {nav.label}
              </NavLink>
            </div>
          ))}
        </nav>

        <div className='ml-auto flex items-center gap-5'>
          <form className='flex items-center gap-2' onSubmit={handleSubmit}>
            <input
              type='text'
              placeholder='Search here...'
              className='bg-transparent px-4 py-1 outline-none border-none hidden lg:block'
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
            />
            <div className='lg:block hidden'>
              <button
                type='button'
                onClick={handleSearchClick}
                className='text-2xl text-white'
              >
                <IoSearchOutline />
              </button>
            </div>
            <div className='lg:hidden'>
              <NavLink
                to='/search'
                className={({ isActive }) => `text-2xl ${isActive ? 'text-white' : 'text-neutral-400'}`}
              >
                <IoSearchOutline />
              </NavLink>
            </div>
          </form>

          <div className="flex items-center justify-center">
            <UserAuthIcon
              user={user}
              handleGoogleLogin={handleGoogleLogin}
              logout={logout}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;