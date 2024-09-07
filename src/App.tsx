import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from "./components/Navbar";
import SignUp from "./Auth/SignUp";
import Hero from './components/Hero';
import '@fontsource/roboto'; 

const App = () => {
  return (
    <Router>
      <div className='bg-black h-full pt-4'>
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;