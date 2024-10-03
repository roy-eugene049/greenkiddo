import React from 'react';
import { motion } from 'framer-motion';

const elcImg = "https://images.unsplash.com/photo-1579567761406-4684ee0c75b6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fHRlY2h8ZW58MHwxfDB8fHww";
const asImg = "https://images.unsplash.com/photo-1555448248-2571daf6344b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFic3RyYWN0fGVufDB8MXwwfHx8MA%3D%3D";
const yjywImg = "https://plus.unsplash.com/premium_photo-1664640458531-3c7cca2a9323?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YWJzdHJhY3R8ZW58MHwxfDB8fHww";

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

export default function Services() {
  return (
    <motion.div 
      className="min-h-screen bg-black text-white flex flex-col items-center py-12 m-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div className="text-center mb-16" variants={itemVariants}>
        <motion.span 
          className="bg-[#32CD32] text-black rounded-full px-4 py-1 mb-2 inline-block text-sm"
          whileHover={{ scale: 1.05 }}
        >
          Why Choose Us
        </motion.span>
        <motion.h1 className="text-4xl font-bold mt-4" variants={itemVariants}>
          The Only Sustainability Learning Platform You'll <span className="text-[#32CD32]">Ever Need</span>
        </motion.h1>
        <motion.p className="mt-4 text-lg" variants={itemVariants}>
          Explore a world of sustainable practices with our curated courses, expert-led workshops, and a passionate community.
        </motion.p>
      </motion.div>

      {/* Bento Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full"
        variants={containerVariants}
      >
        {/* Learning Dashboard */}
        <motion.div 
          className="col-span-1 md:col-span-2 p-6 rounded-lg"
          style={{
            background: 'black', 
            backdropFilter: 'blur(40px)',
            border: '1px solid #333333',
          }}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="text-xl font-semibold mb-4">Learning Dashboard</h3>
          <p className="mb-4">Access a variety of courses and track your progress towards becoming a sustainability expert.</p>
          <motion.div 
            className="p-4 rounded-md space-y-4"
            style={{
              background: '#141414',
              backdropFilter: 'blur(20px)',
              border: '1px solid #333333'
            }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <span>🌱 Complete "Introduction to Sustainable Living"</span>
              <motion.button 
                className="bg-[#32CD32] text-black px-2 py-1 rounded-full text-xs"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Active
              </motion.button>
            </div>
            <div className="flex items-center justify-between">
              <span>🌿 Join "Renewable Energy" Workshop</span>
              <motion.button 
                className="bg-[#32CD32] text-black px-2 py-1 rounded-full text-xs"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Upcoming
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Expert-Led Content */}
        <motion.div 
          className="row-span-2 p-6 rounded-lg flex flex-col"
          style={{
            background: 'black',
            backdropFilter: 'blur(20px)',
            border: '1px solid #333333'
          }}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="text-xl font-semibold mb-4">Expert-Led Content</h3>
          <p>Learn from the best in the field with content created by sustainability experts and thought leaders.</p>
          <motion.div className="mt-4 flex-grow" whileHover={{ scale: 1.03 }}>
            <img src={elcImg} alt="Expert Content" className="w-full h-full object-cover rounded-lg" loading="lazy" />
          </motion.div>
        </motion.div>

        {/* Affordable Subscription */}
        <motion.div 
          className="p-6 rounded-lg flex flex-col max-h-90"
          style={{
            background: 'black',
            backdropFilter: 'blur(20px)',
            border: '1px solid #333333'
          }}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="text-xl font-semibold mb-4">Affordable Subscription</h3>
          <p>Access all courses and resources with a simple, fixed monthly fee. No hidden charges.</p>
          <motion.div className="mt-4 flex-grow" whileHover={{ scale: 1.03 }}>
            <img src={asImg} alt="Subscription" className="w-full h-full object-cover rounded-lg max-h-60" loading="lazy" />
          </motion.div>
        </motion.div>

        {/* Your Journey, Your Way */}
        <motion.div 
          className="p-6 rounded-lg flex flex-col max-h-90"
          style={{
            background: 'black',
            backdropFilter: 'blur(50px)',
            border: '1px solid #333333'
          }}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="text-xl font-semibold mb-4">Your Journey, Your Way</h3>
          <p>Customize your learning experience and explore vast topics that matter most to you at the comfort of your home.</p>
          <motion.div className="mt-4 flex-grow" whileHover={{ scale: 1.03 }}>
            <img src={yjywImg} alt="Customized Journey" className="w-full h-full object-cover rounded-lg max-h-60" loading="lazy" />
          </motion.div>
        </motion.div>

        {/* Flexible Learning */}
        <motion.div 
          className="col-span-1 md:col-span-2 lg:col-span-2 p-6 rounded-lg flex items-center justify-between"
          style={{
            background: 'black',
            backdropFilter: 'blur(20px)',
            border: '1px solid #333333'
          }}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div>
            <h3 className="text-xl font-semibold mb-4">Flexible Learning</h3>
            <p>Learn at your own pace. Pause, resume, or even change your course at any time.</p>
          </div>
          <div className="flex items-center">
            <p className="text-sm mr-2">Your Membership is Active</p>
            <motion.input 
              type="checkbox" 
              checked 
              className="toggle toggle-green-ecco custom-toggle"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
          </div>
        </motion.div>

        {/* Community Forum */}
        <motion.div 
          className="p-6 rounded-lg"
          style={{
            background: 'black',
            backdropFilter: 'blur(20px)',
            border: '1px solid #333333'
          }}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="text-xl font-semibold mb-4">Community Forum</h3>
          <p>Join our community to discuss, share, and collaborate on sustainable living practices.</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}