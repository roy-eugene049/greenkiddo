import { FaFacebookF, FaTwitter, FaYoutube, FaLinkedinIn } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-4 md:px-8 border-t border-[#333333]">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Info */}
          <div className="col-span-1 lg:col-span-2 mr-14">
            <svg
              width="50"
              height="50"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fillRule="evenodd"
              clipRule="evenodd"
              className="fill-current text-green-ecco"
            >
              <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
            </svg>
            <p className="mt-4 text-sm text-gray-400">
              <span className='text-green-ecco'>GreenKiddo</span>
              <br />
              Providing sustainable solutions
            </p>
            <p className="mt-2 text-sm text-gray-400">+254 (333) 333 33</p>
          </div>

          {/* Resources Section */}
          <div>
            <h6 className="text-green-ecco font-bold mb-4">Resources</h6>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-green-ecco transition">SaaS Development</a></li>
              <li><a href="#" className="text-gray-300 hover:text-green-ecco transition">Our Products</a></li>
              <li><a href="#" className="text-gray-300 hover:text-green-ecco transition">User Flow</a></li>
              <li><a href="#" className="text-gray-300 hover:text-green-ecco transition">User Strategy</a></li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h6 className="text-green-ecco font-bold mb-4">Company</h6>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-green-ecco transition">About GreenKiddo</a></li>
              <li><a href="#" className="text-gray-300 hover:text-green-ecco transition">Contact & Support</a></li>
              <li><a href="#" className="text-gray-300 hover:text-green-ecco transition">Success History</a></li>
              <li><a href="#" className="text-gray-300 hover:text-green-ecco transition">Setting & Privacy</a></li>
            </ul>
          </div>

          {/* Quick Links Section */}
          <div>
            <h6 className="text-green-ecco font-bold mb-4">Quick Links</h6>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-green-ecco transition">Premium Support</a></li>
              <li><a href="#" className="text-gray-300 hover:text-green-ecco transition">Our Services</a></li>
              <li><a href="#" className="text-gray-300 hover:text-green-ecco transition">Know Our Team</a></li>
              <li><a href="#" className="text-gray-300 hover:text-green-ecco transition">Download App</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-[#333333] flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} GreenKiddo. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="text-gray-400 hover:text-green-ecco transition">
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-green-ecco transition">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-green-ecco transition">
              <FaYoutube size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-green-ecco transition">
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;