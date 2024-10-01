import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Navbar, Hero, Blog, Contact, AboutUs, Services, Footer, ComingSoon } from './sections';
import { SignedIn, SignedOut } from "@clerk/clerk-react"
import ProtectedRoute from './components/ProtectedRoute';
import '@fontsource/inter/400.css'; 
import '@fontsource/inter/700.css';


const App = () => {
  return (
    <Router>
      <div className='bg-black h-full pt-4'>
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/about' element={<AboutUs />} />
          <Route path='/services' element={<Services />} />
          <Route path='/comingsoon' element={<ComingSoon />} />
          <Route
            path="/comingsoon"
            element={
              <ProtectedRoute>
                <ComingSoon />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sign-in/*"
            element={
              <SignedIn>
                <Navigate to="/comingsoon" replace />
              </SignedIn>
            }
          />
          <Route
            path="/sign-up/*"
            element={
              <SignedIn>
                <Navigate to="/comingsoon" replace state={{ isNewSignUp: true }} />
              </SignedIn>
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;