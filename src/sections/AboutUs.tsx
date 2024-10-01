import { motion } from 'framer-motion';

const AboutUs = () => {
  return (
    <motion.div 
      className="min-h-screen bg-black p-8 flex justify-center items-center relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background animation */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 10,
          ease: "easeInOut",
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-green-500 to-blue-500 opacity-20" />
      </motion.div>

      <div className="grid grid-cols-3 grid-rows-8 gap-4 relative z-10" style={{ width: '100%', maxWidth: '800px' }}>
        {/* Intro Section */}
        <motion.div 
          className="flex flex-col items-center justify-center text-center text-white px-6" 
          style={{ gridColumn: '1 / span 3', gridRow: '1 / span 3' }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-3xl font-bold text-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.strong 
              className="text-green-ecco"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Green Kiddo
            </motion.strong> - A Gateway to a Sustainable Future.
          </motion.h1>
          <motion.p 
            className="text-lg mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Green Kiddo's Platform provides the learner experience and knowledge to 
            <motion.strong 
              className="text-green-ecco"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            > spearhead</motion.strong>, 
            <motion.strong 
              className="text-green-ecco"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            > adopt</motion.strong>, and 
            <motion.strong 
              className="text-green-ecco"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            > practice</motion.strong> sustainability, 
            glocally.
          </motion.p>
        </motion.div>

        {/* Key Points */}
        {[
          { title: "Easy.", description: "Learning and adopting sustainability.", icon: "🌱" },
          { title: "Universal.", description: "To inspire change, we have worldwide accessibility.", icon: "🌍" },
          { title: "Accessible.", description: "Designed for everyone to have an inclusive learning experience.", icon: "🧑‍🤝‍🧑" },
        ].map((item, index) => (
          <motion.div 
            key={index} 
            className="flex flex-col items-center justify-center text-center text-white" 
            style={{ gridColumn: `${index + 1} / span 1`, gridRow: '4 / span 1' }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 * index, duration: 0.5 }}
          >
            <motion.div 
              className="text-4xl mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 * index }}
            >
              {item.icon}
            </motion.div>
            <motion.h2 
              className="text-xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 * index, duration: 0.5 }}
            >
              {item.title}
            </motion.h2>
            <motion.p 
              className="text-md px-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 * index, duration: 0.5 }}
            >
              {item.description}
            </motion.p>
          </motion.div>
        ))}

        {/* Investor Section */}
        <motion.div 
          className="flex flex-col items-center justify-center text-center text-white" 
          style={{ gridColumn: '1 / span 3', gridRow: '5 / span 1' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold">Backed by Incredible Investors</h2>
        </motion.div>

        {/* Investor Logos */}
        {Array.from({ length: 3 }).map((_, index) => (
          <motion.div 
            key={index} 
            className="flex items-center justify-center text-white" 
            style={{ gridColumn: `${index + 1} / span 1`, gridRow: '6 / span 1', height: '150px' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1.2 + 0.2 * index }}
          >
            <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gray-500">
              <p>Logo {index + 1}</p>
            </div>
          </motion.div>
        ))}

        {/* Founder Section */}
        <motion.div 
          className="flex flex-col items-center justify-center text-center text-white" 
          style={{ gridColumn: '1 / span 3', gridRow: '7 / span 1' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold">A Word From Our Founder</h2>
        </motion.div>

        {/* Avatar, Name, and Profession */}
        <motion.div 
          className="flex flex-col items-center justify-center text-center text-white" 
          style={{ gridColumn: '2 / span 1', gridRow: '8 / span 1' }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 2 }}
        >
          {/* Avatar */}
          <motion.img 
            src="/founder.jpg" 
            alt="Founder Avatar" 
            className="rounded-full h-24 w-24 mb-2 object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          />

          {/* Founder Name and Profession */}
          <motion.h3 
            className="text-xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.5 }}
          >
            Roy Eugene
          </motion.h3>
          <motion.p 
            className="text-md italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4, duration: 0.5 }}
          >
            Software Engineer
          </motion.p>
        </motion.div>

        {/* Founder Remarks */}
        <motion.div 
          className="flex flex-col items-center justify-center text-center text-white italic" 
          style={{ gridColumn: '1 / span 3', gridRow: '9 / span 3', width: '75%', margin: '0 auto' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6, duration: 0.8 }}
        >
          <p className="text-green-ecco mb-4">
            "At Green Kiddo, we strive to create a platform that empowers individuals to become champions of sustainability, driving change in their communities and around the world."
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AboutUs;