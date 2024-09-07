import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="hero min-h-screen flex items-center justify-center bg-black">
      <div className="hero-content text-center">
        <div className="max-w-2xl">

            <div className="mb-4 text-xs md:text-sm font-semibold uppercase tracking-wide text-green-950 bg-green-500 px-3 py-1 rounded-full inline-block">
            Inspire Change, One Lesson at a Time
            </div>
          
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Empower Kids. <br /> Sustain the Future.
            </h1>
          
            <p className="text-md md:text-lg text-green-600 mb-8">
                Help kids become sustainability champions with fun and interactive lessons on how to protect our planet. Join the journey to a greener future.
            </p>

            <Link to="/signup">
                <button className="bg-green-500 text-green-950 font-bold py-3 px-6 rounded-full shadow-md hover:bg-green-600 transition duration-300 mb-4">
                Get Started
                </button>
            </Link>
            </div>
      </div>
    </div>
  );
};

export default Hero;