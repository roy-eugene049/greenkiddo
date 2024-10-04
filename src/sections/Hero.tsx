import { motion } from "framer-motion";
import { SignUpButton } from "@clerk/clerk-react";

const text =
  "Help kids become sustainability champions with fun and interactive lessons on how to protect our planet. Join the journey to a greener future.".split(
    " "
  );

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {/* Firefly-like particles */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-green-400"
            style={{
              width: Math.random() * 4 + 1 + "px",
              height: Math.random() * 4 + 1 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.8, 0.2],
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
        {/* Glowing orb */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-gradient-radial from-green-500/30 to-transparent"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </motion.div>

      <div className="hero-content text-center z-10">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="mb-4 text-xs md:text-sm font-semibold uppercase tracking-wide text-green-ecco bg-green-950/50 px-3 py-1 rounded-full inline-block"
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

          <motion.p
      className="text-md md:text-lg text-green-ecco mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.7 }}
    >
        {text.map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="inline-block mr-1"
          >
            {word}
          </motion.span>
        ))}
      </motion.p>

          <SignUpButton>
            <motion.button
              className="bg-green-ecco text-green-950 font-bold py-3 px-6 rounded-full shadow-md hover:bg-green-300 transition duration-300 mb-4 mx-auto"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              whileTap={{ scale: 0.95 }}
            >
              Join the Waitlist
            </motion.button>
          </SignUpButton>
        </motion.div>
      </div>
    </div>
  )
};

export default Hero;