const Contact = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black mt-6 m-6">
      <div className="p-10 rounded-lg w-full max-w-5xl flex"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}>
        
        {/* Signup Form Section */}
        <div className="w-full lg:w-1/2 pr-8">
          <h1 className="text-3xl font-bold mb-6 text-green-ecco text-center">
            Let's Have a Chat <span className="wave-emoji">👋</span>
          </h1>
          <p className="text-center font-bold mb-8">
            Questions about our products/services, orders, or just want to say hello? We're here to help.
          </p>
          
          <form className="space-y-6">
            {/* Grid for Name, Email, and Phone */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="col-span-2 bg-transparent border-b-2 border-white/30 text-white/70 focus:font-semibold focus:border-green-ecco focus:text-white focus:outline-none p-2 transition-colors duration-300"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="col-span-2 bg-transparent border-b-2 border-white/30 focus:font-semibold text-white/70 focus:border-green-ecco focus:text-white focus:outline-none p-2 transition-colors duration-300"
              />
              <input
                type="email"
                placeholder="Email"
                className="col-span-2 bg-transparent border-b-2 border-white/30 focus:font-semibold text-white/70 focus:border-green-ecco focus:text-white focus:outline-none p-2 transition-colors duration-300"
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="col-span-2 bg-transparent border-b-2 border-white/30 focus:font-semibold text-white/70 focus:border-green-ecco focus:text-white focus:outline-none p-2 transition-colors duration-300"
              />
            </div>

            <input
              type="text"
              placeholder="Subject"
              className="w-full bg-transparent border-b-2 border-white/30 focus:font-semibold text-white/70 focus:border-green-ecco focus:text-white focus:outline-none p-2 transition-colors duration-300"
            />
            <textarea
              placeholder="Message"
              className="w-full bg-transparent border-b-2 border-white/30 focus:font-semibold text-white/70 focus:border-green-ecco focus:text-white focus:outline-none p-2 h-32 resize-none transition-colors duration-300"
            />

            <button
              type="submit"
              className="w-full bg-green-ecco text-green-950 py-3 rounded-md font-bold hover:bg-opacity-80 transition duration-200"
            >
              Send Message
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

        {/* Image Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1530&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Contact Illustration" 
            className="rounded-lg shadow-lg w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;