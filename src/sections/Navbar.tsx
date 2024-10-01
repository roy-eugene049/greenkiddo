import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton, SignUpButton } from "@clerk/clerk-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to toggle mobile menu
  const toggleMenu = () => setIsOpen(!isOpen); // Toggle function

  const location = useLocation(); // Get the current route

  const isActiveRoute = (path: string) => location.pathname === path; // Check if route matches

  return (
    <div className="navbar space-x-10 sticky top-4 z-50 bg-black/80 backdrop-blur-lg text-white rounded-full p-2 border border-white/20 max-w-6xl mx-auto shadow-lg shadow-black/40">
      <div className="navbar-start">
        <Link to="/" className="text-xl ml-2 font-bold normal-case text-green-ecco">
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
        <li>
            <Link to="/">
              <a className={`font-semibold ${isActiveRoute("/") ? "text-green-ecco" : "text-white"}`}>
                Home
              </a>
            </Link>
          </li>

          <li>
            <Link to="/about">
              <a className={`font-semibold ${isActiveRoute("/about") ? "text-green-ecco" : "text-white"}`}>
                About Us
              </a>
            </Link>
          </li>

          <li>
            <Link to="/services">
              <a className={`font-semibold ${isActiveRoute("/services") ? "text-green-ecco" : "text-white"}`}>
                Services
              </a>
            </Link>
          </li>

          <li>
            <Link to="/contact">
              <a className={`font-semibold ${isActiveRoute("/contact") ? "text-green-ecco" : "text-white"}`}>
                Contact
              </a>
            </Link>
          </li>

          <li>
            <Link to="/blog">
              <a className={`font-semibold ${isActiveRoute("/blog") ? "text-green-ecco" : "text-white"}`}>
                Blog
              </a>
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="navbar-center lg:hidden absolute top-full left-0 w-full bg-black/80 backdrop-blur-lg rounded-lg shadow-lg">
          <ul className="menu px-2 py-3 space-y-2">
            <li>
              <Link to="/about">
                <a className={`font-semibold ${isActiveRoute("/about") ? "text-green-ecco" : "text-white"}`}>
                  About Us
                </a>
              </Link>
            </li>

            <li>
              <Link to="/services">
                <a className={`font-semibold ${isActiveRoute("/services") ? "text-green-ecco" : "text-white"}`}>
                  Services
                </a>
              </Link>
            </li>

            <li>
              <Link to="/contact">
                <a className={`font-semibold ${isActiveRoute("/contact") ? "text-green-ecco" : "text-white"}`}>
                  Contact
                </a>
              </Link>
            </li>

            <li>
              <Link to="/blog">
                <a className={`font-semibold ${isActiveRoute("/blog") ? "text-green-ecco" : "text-white"}`}>
                  Blog
                </a>
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* Auth Buttons */}
      <div className="navbar-end hidden lg:flex items-center space-x-4">
        <SignedOut>
          <SignInButton redirectUrl="/comingsoon">
            <motion.button whileTap={{ scale: 0.85 }}>
              <a className="btn bg-green-ecco text-green-900 rounded-full px-5 font-bold border border-green-800">
                Sign In
              </a>
            </motion.button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
};

export default Navbar;