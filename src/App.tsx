import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navbar, Hero, Blog, Contact, AboutUs, Services, Footer, ComingSoon } from './sections';
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
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;