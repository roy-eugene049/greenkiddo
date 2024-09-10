import React from 'react';

const Contact = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black mt-6">
      <div className="bg-black border border-white/20 text-white p-10 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-ecco">
          Let's Have a Chat <span className="wave-emoji">👋</span>
        </h1>
        <p className="text-center mb-8">
          Questions about our products/services, orders, or just want to say hello? We're here to help.
        </p>
        
        <form className="space-y-6">
          {/* Grid for Name, Email, and Phone */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="First name"
              className="col-span-2 bg-transparent border-b-2 border-green-ecco focus:outline-none focus:border-green-ecco text-white p-2"
            />
            <input
              type="text"
              placeholder="Last name"
              className="col-span-2 bg-transparent border-b-2 border-green-ecco focus:outline-none focus:border-green-ecco text-white p-2"
            />
            <input
              type="email"
              placeholder="Email"
              className="col-span-2 bg-transparent border-b-2 border-green-ecco focus:outline-none focus:border-green-ecco text-white p-2"
            />
            <input
              type="text"
              placeholder="Phone number"
              className="col-span-2 bg-transparent border-b-2 border-green-ecco focus:outline-none focus:border-green-ecco text-white p-2"
            />
          </div>

          <input
            type="text"
            placeholder="Subject"
            className="w-full bg-transparent border-b-2 border-green-ecco focus:outline-none focus:border-green-ecco text-white p-2"
          />
          <textarea
            placeholder="Message"
            className="w-full bg-transparent border-b-2 border-green-ecco focus:outline-none focus:border-green-ecco text-white p-2 h-32 resize-none"
          />

          <button
            type="submit"
            className="w-full bg-green-ecco text-black py-3 rounded-md font-semibold hover:bg-opacity-80 transition duration-200"
          >
            Send message
          </button>
        </form>

        {/* Socials */}
        <div className="flex justify-center space-x-4 mt-8">
          <a href="#" className="text-white hover:text-green-ecco transition duration-200">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="text-white hover:text-green-ecco transition duration-200">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="text-white hover:text-green-ecco transition duration-200">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="text-white hover:text-green-ecco transition duration-200">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;