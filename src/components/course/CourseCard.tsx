import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Course } from '../../types/course';
import { Clock, Users, Star } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  showProgress?: boolean;
  progressPercentage?: number;
  onEnroll?: (courseId: string) => void;
}

export const CourseCard = ({ 
  course, 
  showProgress = false, 
  progressPercentage = 0,
  onEnroll 
}: CourseCardProps) => {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <motion.div
      className="bg-black border border-gray-700 rounded-lg overflow-hidden hover:border-green-ecco/50 transition-all duration-300"
      whileHover={{ scale: 1.02, y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Thumbnail */}
      <Link to={`/courses/${course.id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              course.price.isFree 
                ? 'bg-green-ecco text-black' 
                : 'bg-yellow-500 text-black'
            }`}>
              {course.price.isFree ? 'Free' : `$${course.price.amount}`}
            </span>
          </div>
          <div className="absolute bottom-2 left-2">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-black/70 text-white backdrop-blur-sm`}>
              {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
            </span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={`/courses/${course.id}`}>
          <h3 className="text-xl font-bold text-white mb-2 hover:text-green-ecco transition-colors">
            {course.title}
          </h3>
        </Link>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {course.shortDescription || course.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(course.duration)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{course.enrolledCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            <span>{course.rating.average.toFixed(1)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <motion.div
                className="bg-green-ecco h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-4">
          {course.instructor.avatar && (
            <img
              src={course.instructor.avatar}
              alt={course.instructor.name}
              className="w-6 h-6 rounded-full"
            />
          )}
          <span className="text-sm text-gray-400">{course.instructor.name}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {course.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex gap-2">
          {showProgress ? (
            <Link
              to={`/courses/${course.id}`}
              className="flex-1 bg-green-ecco text-black font-bold py-2 px-4 rounded-full text-center hover:bg-green-300 transition-colors"
            >
              Continue Learning
            </Link>
          ) : (
            <>
              <Link
                to={`/courses/${course.id}`}
                className="flex-1 border border-gray-600 text-white font-semibold py-2 px-4 rounded-full text-center hover:border-green-ecco hover:text-green-ecco transition-colors"
              >
                View Details
              </Link>
              {onEnroll && (
                <motion.button
                  onClick={() => onEnroll(course.id)}
                  className="flex-1 bg-green-ecco text-black font-bold py-2 px-4 rounded-full hover:bg-green-300 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Enroll
                </motion.button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

