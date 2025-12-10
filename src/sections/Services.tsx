import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { CourseCard } from '../components/course/CourseCard';
import { CourseService } from '../services/courseService';
import { Course } from '../types/course';

const elcImg = "https://images.unsplash.com/photo-1579567761406-4684ee0c75b6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fHRlY2h8ZW58MHwxfDB8fHww";
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
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);

  useEffect(() => {
    const loadFeaturedCourses = async () => {
      try {
        const allCourses = await CourseService.getAllCourses();
        // Get first 3 courses as featured
        setFeaturedCourses(allCourses.slice(0, 3));
      } catch (error) {
        console.error('Error loading featured courses:', error);
      }
    };
    loadFeaturedCourses();
  }, []);

  const handleDashboardClick = () => {
    if (isSignedIn) {
      navigate('/dashboard');
    } else {
      navigate('/sign-in');
    }
  };

  const handleEnroll = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

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
          className="col-span-1 md:col-span-2 p-6 rounded-lg cursor-pointer"
          style={{
            background: 'black', 
            backdropFilter: 'blur(40px)',
            border: '1px solid #333333',
          }}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          onClick={handleDashboardClick}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Learning Dashboard</h3>
            <Link
              to={isSignedIn ? '/dashboard' : '/sign-in'}
              className="text-green-ecco hover:text-green-300 text-sm font-semibold"
              onClick={(e) => e.stopPropagation()}
            >
              View Dashboard →
            </Link>
          </div>
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
        <Link to="/courses" className="row-span-2">
          <motion.div 
            className="p-6 rounded-lg flex flex-col h-full cursor-pointer"
            style={{
              background: 'black',
              backdropFilter: 'blur(20px)',
              border: '1px solid #333333'
            }}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Expert-Led Content</h3>
              <span className="text-green-ecco text-sm font-semibold">Browse →</span>
            </div>
            <p>Learn from the best in the field with content created by sustainability experts and thought leaders.</p>
            <motion.div className="mt-4 flex-grow" whileHover={{ scale: 1.03 }}>
              <img src={elcImg} alt="Expert Content" className="w-full h-full object-cover rounded-lg" loading="lazy" />
            </motion.div>
          </motion.div>
        </Link>

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
          <h3 className="text-xl font-bold mb-4">Free Access</h3>
          <p>Access all courses and resources completely free. No hidden charges, no subscriptions required.</p>
          <div className="mt-4 p-4 bg-green-ecco/10 rounded-lg border border-green-ecco/30">
            <div className="text-3xl font-bold text-green-ecco mb-1">$0</div>
            <div className="text-sm text-gray-400">Forever Free</div>
          </div>
        </motion.div>

        {/* Your Journey, Your Way */}
        <Link to="/courses">
          <motion.div 
            className="p-6 rounded-lg flex flex-col max-h-90 cursor-pointer"
            style={{
              background: 'black',
              backdropFilter: 'blur(50px)',
              border: '1px solid #333333'
            }}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Your Journey, Your Way</h3>
              <span className="text-green-ecco text-sm font-semibold">Explore →</span>
            </div>
            <p>Customize your learning experience and explore vast topics that matter most to you at the comfort of your home.</p>
            <motion.div className="mt-4 flex-grow" whileHover={{ scale: 1.03 }}>
              <img src={yjywImg} alt="Customized Journey" className="w-full h-full object-cover rounded-lg max-h-60" loading="lazy" />
            </motion.div>
          </motion.div>
        </Link>

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
            <h3 className="text-xl font-bold mb-4">Flexible Learning</h3>
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
          className="p-6 rounded-lg cursor-pointer"
          style={{
            background: 'black',
            backdropFilter: 'blur(20px)',
            border: '1px solid #333333'
          }}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/courses')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Community Forum</h3>
            <span className="text-green-ecco hover:text-green-300 text-sm font-semibold">
              Coming Soon →
            </span>
          </div>
          <p>Join our community to discuss, share, and collaborate on sustainable living practices.</p>
        </motion.div>
      </motion.div>

      {/* Featured Courses Section */}
      {featuredCourses.length > 0 && (
        <motion.div 
          className="w-full max-w-6xl mt-16"
          variants={itemVariants}
        >
          <div className="text-center mb-8">
            <motion.span 
              className="bg-[#32CD32] text-black rounded-full px-4 py-1 mb-2 inline-block text-sm"
              whileHover={{ scale: 1.05 }}
            >
              Featured Courses
            </motion.span>
            <motion.h2 className="text-3xl font-bold mt-4" variants={itemVariants}>
              Start Your <span className="text-[#32CD32]">Sustainability Journey</span>
            </motion.h2>
            <motion.p className="mt-4 text-lg text-gray-400" variants={itemVariants}>
              Explore our most popular courses and begin learning today
            </motion.p>
          </div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {featuredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                variants={itemVariants}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <CourseCard course={course} onEnroll={handleEnroll} />
              </motion.div>
            ))}
          </motion.div>
          <motion.div className="text-center mt-8" variants={itemVariants}>
            <Link
              to="/courses"
              className="inline-block bg-green-ecco text-black font-bold py-3 px-8 rounded-full hover:bg-green-300 transition-colors"
            >
              View All Courses →
            </Link>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
