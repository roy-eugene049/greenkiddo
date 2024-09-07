// src/components/Hero.tsx
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="hero min-h-screen flex items-center justify-center bg-black">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-green-950 bg-green-500 px-3 py-1 rounded-full inline-block">
            Unlock Conversational Power
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Empower Your Conversations with Next-Gen Messaging Dashboard
          </h1>
          <p className="text-lg text-green-600 mb-8">
            Unlock seamless communication and streamline your messaging experience with our innovative dashboard solution.
          </p>
          <Link to="/signup">
            <button className="btn bg-green-500 text-green-950 font-bold py-3 px-6 rounded-full shadow-md border">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
