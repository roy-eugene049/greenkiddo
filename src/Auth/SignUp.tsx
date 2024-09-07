import React from 'react';

const SignUp = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-4">
      <h2 className="text-xl mb-2 text-gray-400">GreenKiddo | E-learning Magic</h2>
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-white">
        Join the waitlist for the <br /> <span className="text-green-500">GreenKiddo Beta Platform</span>
      </h1>

      <form className="w-full max-w-md space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Full name..."
            className="w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 py-2 px-3"
          />
        </div>

        <div className="relative">
          <input
            type="email"
            placeholder="Address email..."
            className="w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 py-2 px-3"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-green-900 py-3 px-4 rounded-full shadow-lg font-bold mt-4 hover:bg-green-600 transition duration-300"
        >
          Join the waitlist
        </button>
      </form>

      <div className="mt-8 flex space-x-6 text-gray-400">
        <a href="#" className="hover:text-green-500">Twitter @greenkiddo</a>
        <a href="#" className="hover:text-green-500">Medium @greenkiddo</a>
      </div>
    </div>
  );
};

export default SignUp;