// src/components/Navbar.tsx
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar text-white rounded-full p-2 border border-white/20 max-w-6xl mx-auto shadow-lg">
      <div className="navbar-start">
        <p className="text-xl ml-2 font-bold normal-case text-white">
          GreenKiddo
        </p>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><a className="font-semibold text-white">About</a></li>
          <li><a className="font-semibold text-white">Services</a></li>
          <li><a className="font-semibold text-white">Integrations</a></li>
          <li><a className="font-semibold text-white">Resource</a></li>
        </ul>
      </div>

      <div className="navbar-end">
        <a className="btn bg-green-500 text-green-900 rounded-full px-5 font-bold border border-green-800">
          Download Now
        </a>
      </div>
    </div>
  );
};

export default Navbar;
