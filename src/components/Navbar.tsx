import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton, SignOutButton } from "@clerk/clerk-react";

const Navbar = () => {
  return (
    <div className="navbar sticky top-4 z-50 bg-black/80 backdrop-blur-lg text-white rounded-full p-2 border border-white/20 max-w-6xl mx-auto shadow-lg shadow-black/40">
      <div className="navbar-start">
        <Link to="/" className="text-xl ml-2 font-bold normal-case text-white">
          GreenKiddo
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><a className="font-semibold text-white">About</a></li>
          <li><a className="font-semibold text-white">Services</a></li>
          <li><a className="font-semibold text-white">Integrations</a></li>
          <li><a className="font-semibold text-white">Resource</a></li>
        </ul>
      </div>

      <div className="navbar-end flex items-center space-x-4">
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