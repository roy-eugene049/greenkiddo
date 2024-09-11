import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navbar, Hero, Blog, Contact, About, Services, Footer } from './components';

import '@fontsource/roboto'; 

const App = () => {
  return (
    <Router>
      <div className='bg-black h-full pt-4'>
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/about' element={<About />} />
          <Route path='/services' element={<Services />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;