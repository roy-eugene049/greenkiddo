import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Hero from './components/Hero';
import Blog from './components/Blog';
import Contact from './components/Contact';
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;