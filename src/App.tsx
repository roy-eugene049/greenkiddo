import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Navbar, Hero, Blog, Contact, AboutUs, Services, Footer, ComingSoon } from './sections';
import { SignedIn } from "@clerk/clerk-react"
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import CourseCatalog from './pages/CourseCatalog';
import CourseDetail from './pages/CourseDetail';
import LessonView from './pages/LessonView';
import QuizView from './pages/QuizView';
import Certificates from './pages/Certificates';
import Achievements from './pages/Achievements';
import Bookmarks from './pages/Bookmarks';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import BlogPostDetail from './pages/BlogPostDetail';
import CommunityForum from './pages/CommunityForum';
import PostDetail from './pages/PostDetail';
import NewPost from './pages/NewPost';
import SearchResults from './pages/SearchResults';
import AdminDashboard from './pages/admin/AdminDashboard';
import CourseManagement from './pages/admin/CourseManagement';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import UserManagement from './pages/admin/UserManagement';
import '@fontsource/inter/400.css'; 
import '@fontsource/inter/700.css';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes - Redirect to Dashboard */}
        <Route
          path="/sign-in/*"
          element={
            <SignedIn>
              <Navigate to="/dashboard" replace />
            </SignedIn>
          }
        />
        <Route
          path="/sign-up/*"
          element={
            <SignedIn>
              <Navigate to="/dashboard" replace state={{ isNewSignUp: true }} />
            </SignedIn>
          }
        />
        
        {/* LMS Routes (Dashboard Layout - No Navbar/Footer) */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/courses" element={<Dashboard />} />
                <Route path="/certificates" element={<Certificates />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/community" element={<CommunityForum />} />
                <Route path="/community/new" element={<NewPost />} />
                <Route path="/community/posts/:postId" element={<PostDetail />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/courses" element={<CourseManagement />} />
                <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
              </Routes>
            </ProtectedRoute>
          }
        />
        
        {/* Lesson View (Protected, uses DashboardLayout) */}
        <Route
          path="/courses/:courseId/lessons/:lessonId"
          element={
            <ProtectedRoute>
              <LessonView />
            </ProtectedRoute>
          }
        />
        
        {/* Quiz View (Protected, uses DashboardLayout) */}
        <Route
          path="/courses/:courseId/lessons/:lessonId/quiz"
          element={
            <ProtectedRoute>
              <QuizView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:courseId/lessons/:lessonId/quiz/:quizId"
          element={
            <ProtectedRoute>
              <QuizView />
            </ProtectedRoute>
          }
        />
        
        {/* Public Routes (With Navbar/Footer) */}
        <Route
          path="/*"
          element={
            <div className='bg-black h-full pt-4'>
              <Navbar />
              <Routes>
                <Route path="/" element={<Hero />} />
                <Route path='/blog' element={<Blog />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/about' element={<AboutUs />} />
                <Route path='/services' element={<Services />} />
                <Route path='/courses' element={<CourseCatalog />} />
                <Route path='/courses/:courseId' element={<CourseDetail />} />
                <Route path='/courses/:courseId/lessons/:lessonId' element={<LessonView />} />
                <Route path='/blog/:slug' element={<BlogPostDetail />} />
                <Route path='/comingsoon' element={<ComingSoon />} />
                <Route
                  path="/comingsoon"
                  element={
                    <ProtectedRoute>
                      <ComingSoon />
                    </ProtectedRoute>
                  }
                />
              </Routes>
              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
