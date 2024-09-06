
const NavAndHero = () => {
  return (
    <div className="min-h-screen bg-black text-white">
    {/* Navbar */}
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

    {/* Hero Section */}
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
          <button className="btn bg-green-500 text-green-950 font-bold py-3 px-6 rounded-full shadow-md border">
            Get Started
          </button>
        </div>
      </div>
</div>

  </div>
  );
};

export default NavAndHero;
