import React from 'react';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.1,
      when: "beforeChildren"
    } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const Contact = () => {
  return (
    <motion.div 
      className="flex justify-center items-center min-h-screen bg-black mt-6 m-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="p-10 rounded-lg w-full max-w-5xl flex"
        style={{
          background: 'black',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
        variants={itemVariants}
      >
        
        {/* Signup Form Section */}
        <motion.div className="w-full lg:w-1/2 pr-8" variants={itemVariants}>
          <motion.h1 
            className="text-3xl font-bold mb-6 text-green-ecco text-center"
            variants={itemVariants}
          >
            Let's Have a Chat <span className="wave-emoji">👋</span>
          </motion.h1>
          <motion.p 
            className="text-center font-bold mb-8"
            variants={itemVariants}
          >
            Questions about our products/services, orders, or just want to say hello? We're here to help.
          </motion.p>
          
          <motion.form className="space-y-6" variants={containerVariants}>
            {/* Grid for Name, Email, and Phone */}
            <motion.div className="grid grid-cols-1 lg:grid-cols-4 gap-4" variants={containerVariants}>
              <motion.input
                type="text"
                placeholder="First Name"
                className="col-span-2 bg-transparent border-b-2 border-white/30 text-white/70 focus:font-semibold focus:border-green-ecco focus:text-white focus:outline-none p-2 transition-colors duration-300 autofill:bg-black autofill:text-white"
                variants={itemVariants}
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="text"
                placeholder="Last Name"
                className="col-span-2 bg-transparent border-b-2 border-white/30 focus:font-semibold text-white/70 focus:border-green-ecco focus:text-white focus:outline-none p-2 transition-colors duration-300 autofill:bg-black autofill:text-white"
                variants={itemVariants}
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="email"
                placeholder="Email"
                className="col-span-2 bg-transparent border-b-2 border-white/30 focus:font-semibold text-white/70 focus:border-green-ecco focus:text-white focus:outline-none p-2 transition-colors duration-300 autofill:bg-black autofill:text-white"
                variants={itemVariants}
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="text"
                placeholder="Phone Number"
                className="col-span-2 bg-transparent border-b-2 border-white/30 focus:font-semibold text-white/70 focus:border-green-ecco focus:text-white focus:outline-none p-2 transition-colors duration-300 autofill:bg-black autofill:text-white"
                variants={itemVariants}
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>

            <motion.input
              type="text"
              placeholder="Subject"
              className="w-full bg-transparent border-b-2 border-white/30 focus:font-semibold text-white/70 focus:border-green-ecco focus:text-white focus:outline-none p-2 transition-colors duration-300 autofill:bg-black autofill:text-white"
              variants={itemVariants}
              whileFocus={{ scale: 1.02 }}
            />
            <motion.textarea
              placeholder="Message"
              className="w-full bg-transparent border-b-2 border-white/30 focus:font-semibold text-white/70 focus:border-green-ecco focus:text-white focus:outline-none p-2 h-32 resize-none transition-colors duration-300"
              variants={itemVariants}
              whileFocus={{ scale: 1.02 }}
            />

            <motion.button
              type="submit"
              className="w-full bg-green-ecco text-green-950 py-3 rounded-md font-bold hover:bg-opacity-80 transition duration-200"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send Message
            </motion.button>
          </motion.form>

          {/* Socials */}
          <motion.div 
            className="flex justify-center space-x-4 mt-8"
            variants={containerVariants}
          >
            <motion.a href="#" className="text-white hover:text-green-ecco transition duration-200" variants={itemVariants} whileHover={{ scale: 1.2 }}>
              <i className="fab fa-facebook-f"></i>
            </motion.a>
            <motion.a href="#" className="text-white hover:text-green-ecco transition duration-200" variants={itemVariants} whileHover={{ scale: 1.2 }}>
              <i className="fab fa-twitter"></i>
            </motion.a>
            <motion.a href="#" className="text-white hover:text-green-ecco transition duration-200" variants={itemVariants} whileHover={{ scale: 1.2 }}>
              <i className="fab fa-instagram"></i>
            </motion.a>
            <motion.a href="#" className="text-white hover:text-green-ecco transition duration-200" variants={itemVariants} whileHover={{ scale: 1.2 }}>
              <i className="fab fa-linkedin"></i>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Image Section */}
        <motion.div 
          className="w-full lg:w-1/2 flex items-center justify-center"
          variants={itemVariants}
        >
          <LazyLoadImage
            src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1530&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Contact Illustration" 
            effect="blur"
            className="rounded-lg shadow-lg w-full h-auto"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Contact;