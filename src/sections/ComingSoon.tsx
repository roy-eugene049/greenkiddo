import { motion } from "framer-motion"
import { Leaf } from "lucide-react"
import { useUser } from "@clerk/clerk-react"
import { useLocation } from "react-router-dom"


const ComingSoon = () => {
  const { user, isLoaded } = useUser()
  const location = useLocation()
  const isNewSignUp = location.state?.isNewSignUp

  const getMessage = () => {
    if (!isLoaded) return "Loading..."
    if (isNewSignUp) return "Thank You for Signing Up!"
    if (user) return "Welcome Back!"
    return "Coming Soon"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto text-center"
      >
        <Leaf className="w-16 h-16 mx-auto mb-8 text-green-ecco" />
        <h1 className="text-4xl font-bold mb-6">{getMessage()}</h1>
        <p className="text-xl mb-8">
          {isNewSignUp ? "Welcome to" : "Thank you for joining"} <span className="text-green-ecco">GreenKiddo</span>, where sustainability meets learning!
        </p>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-green-ecco">What to Expect</h2>
          <ul className="text-left space-y-2">
            <li className="flex items-center">
              <span className="mr-2 text-green-ecco">✔</span> Personalized learning materials
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-ecco">✔</span> Interactive sustainability challenges
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-ecco">✔</span> Progress tracking and achievements
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-ecco">✔</span> Community forums and discussions
            </li>
          </ul>
        </div>
        <p className="text-green-ecco">
          We're working hard to create an amazing learning experience for you. 
          Stay tuned for updates!
        </p>
        <motion.div 
          className="mt-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
        >
          <button className="bg-green-ecco text-green-950 px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition duration-300">
            Notify Me When It's Ready
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default ComingSoon