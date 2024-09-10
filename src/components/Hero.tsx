import { motion } from "framer-motion";
import { SignUpButton } from "@clerk/clerk-react";

const text =
  "Help kids become sustainability champions with fun and interactive lessons on how to protect our planet. Join the journey to a greener future.".split(
    " "
  );

const Hero = () => {
  return (
    <div className="hero min-h-screen flex items-center justify-center bg-black">
      <div className="hero-content text-center">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="mb-4 text-xs md:text-sm font-semibold uppercase tracking-wide text-green-950 bg-green-500 px-3 py-1 rounded-full inline-block"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Inspire Change, One Lesson at a Time
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Empower Kids. <br /> Sustain the Future.
          </motion.h1>

          {/* Wrap the text inside a div to avoid layout break */}
          <motion.div className="text-center mb-8">
            {text.map((el, i) => (
              <motion.span
                className="text-md md:text-lg text-green-600"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                }}
                key={i}
              >
                {el}{" "}
              </motion.span>
            ))}
          </motion.div>

          {/* Add margin and keep button centered */}
          <SignUpButton>
            <motion.button
              className="bg-green-500 text-green-950 font-bold py-3 px-6 rounded-full shadow-md hover:bg-green-600 transition duration-300 mb-4 mx-auto"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              whileTap={{ scale: 0.85 }}
            >
              Join the Waitlist
            </motion.button>
          </SignUpButton>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
