import { useState } from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton, SignOutButton } from "@clerk/clerk-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to toggle mobile menu

  const toggleMenu = () => setIsOpen(!isOpen); // Toggle function

  return (
    <div className="navbar sticky top-4 z-50 bg-black/80 backdrop-blur-lg text-white rounded-full p-2 border border-white/20 max-w-6xl mx-auto shadow-lg shadow-black/40">
      <div className="navbar-start">
        <Link to="/" className="text-xl ml-2 font-bold normal-case text-white">
          GreenKiddo
        </Link>
      </div>

      {/* Hamburger Icon for small screens */}
      <div className="navbar-end lg:hidden">
        <button
          className="text-white focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            ></path>
          </svg>
        </button>
      </div>

      {/* Menu for larger screens */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><a className="font-semibold text-white">About</a></li>
          <li><a className="font-semibold text-white">Services</a></li>
          
          <Link to="/contact">
            <li><a className="font-semibold text-white">Contact</a></li>
          </Link>
          
          <Link to="/blog">
            <li><a className="font-semibold text-white">Blog</a></li>
          </Link>
        </ul>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="navbar-center lg:hidden absolute top-full left-0 w-full bg-black/80 backdrop-blur-lg rounded-lg shadow-lg">
          <ul className="menu px-2 py-3 space-y-2">
            <li><a className="font-semibold text-white">About</a></li>
            <li><a className="font-semibold text-white">Services</a></li>
            
            <Link to="/contact">
              <li><a className="font-semibold text-white">Contact</a></li>
            </Link>
            
            <Link to="/blog">
              <li><a className="font-semibold text-white">Blog</a></li>
            </Link>
          </ul>
        </div>
      )}

      {/* Auth Buttons */}
      <div className="navbar-end hidden lg:flex items-center space-x-4">
        {/* When user is signed out */}
        <SignedOut>
          <SignInButton>
            <a className="btn bg-green-500 text-green-900 rounded-full px-5 font-bold border border-green-800">
              Sign In
            </a>
          </SignInButton>
        </SignedOut>

        {/* When user is signed in */}
        <SignedIn>
          <UserButton />
          
          <SignOutButton>
            <a className="btn bg-red-500 text-white rounded-full px-5 font-bold border border-red-800">
              Sign Out
            </a>
          </SignOutButton>
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;