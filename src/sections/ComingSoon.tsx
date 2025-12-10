import { motion } from "framer-motion"
import { Leaf, BookOpen, Award, Target, ArrowRight } from "lucide-react"
import { useUser } from "@clerk/clerk-react"
import { useNavigate, Link } from "react-router-dom"
import { useEffect } from "react"

const ComingSoon = () => {
  const { user, isLoaded } = useUser()
  const navigate = useNavigate()

  // Auto-redirect to dashboard after 3 seconds if user is signed in
  useEffect(() => {
    if (isLoaded && user) {
      const timer = setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isLoaded, user, navigate])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
        >
          <Leaf className="w-20 h-20 mx-auto mb-6 text-green-ecco" />
        </motion.div>
        
        <h1 className="text-5xl font-bold mb-4">
          Welcome to <span className="text-green-ecco">GreenKiddo</span>!
        </h1>
        <p className="text-xl mb-12 text-gray-300">
          Your journey to sustainability starts here. Learn, grow, and make a difference!
        </p>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link to="/dashboard">
            <motion.div
              className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-ecco transition-all cursor-pointer"
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Target className="w-12 h-12 mx-auto mb-4 text-green-ecco" />
              <h3 className="text-xl font-semibold mb-2">My Dashboard</h3>
              <p className="text-gray-400 text-sm">Track your progress and continue learning</p>
              <ArrowRight className="w-5 h-5 mx-auto mt-4 text-green-ecco" />
            </motion.div>
          </Link>

          <Link to="/courses">
            <motion.div
              className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-ecco transition-all cursor-pointer"
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-green-ecco" />
              <h3 className="text-xl font-semibold mb-2">Browse Courses</h3>
              <p className="text-gray-400 text-sm">Explore our sustainability courses</p>
              <ArrowRight className="w-5 h-5 mx-auto mt-4 text-green-ecco" />
            </motion.div>
          </Link>

          <Link to="/dashboard/achievements">
            <motion.div
              className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-ecco transition-all cursor-pointer"
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Award className="w-12 h-12 mx-auto mb-4 text-green-ecco" />
              <h3 className="text-xl font-semibold mb-2">Achievements</h3>
              <p className="text-gray-400 text-sm">View your badges and certificates</p>
              <ArrowRight className="w-5 h-5 mx-auto mt-4 text-green-ecco" />
            </motion.div>
          </Link>
        </div>

        {/* Features List */}
        <motion.div
          className="bg-gray-800/50 p-6 rounded-lg shadow-lg mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-green-ecco">What You Can Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start">
              <span className="mr-3 text-green-ecco text-xl">✓</span>
              <div>
                <h4 className="font-semibold mb-1">Interactive Courses</h4>
                <p className="text-sm text-gray-400">Learn through videos, articles, and interactive content</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-3 text-green-ecco text-xl">✓</span>
              <div>
                <h4 className="font-semibold mb-1">Track Your Progress</h4>
                <p className="text-sm text-gray-400">Monitor your learning journey with detailed analytics</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-3 text-green-ecco text-xl">✓</span>
              <div>
                <h4 className="font-semibold mb-1">Earn Certificates</h4>
                <p className="text-sm text-gray-400">Get certified as you complete courses</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-3 text-green-ecco text-xl">✓</span>
              <div>
                <h4 className="font-semibold mb-1">Take Notes & Bookmarks</h4>
                <p className="text-sm text-gray-400">Save important lessons and take notes</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 260, damping: 20 }}
        >
          <Link to="/dashboard">
            <button className="bg-green-ecco text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-green-300 transition-colors flex items-center gap-2 mx-auto">
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            Redirecting automatically in 3 seconds...
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default ComingSoon