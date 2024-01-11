import React from 'react';
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from './pages/Register';
import Buttons from './pages/Buttons';
import Alerts from './pages/Alerts';
import Cards from './pages/Cards';
import Forms from './pages/Forms';
import Sample from './pages/Sample';
import Typography from './pages/Typography';
import Icon from './pages/Icon';


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>

          <Route path="/" element={<Index />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Buttons" element={<Buttons />} />
          <Route path="/Alerts" element={<Alerts />} />
          <Route path="/Cards" element={<Cards />} />
          <Route path="/Forms" element={<Forms />} />
          <Route path="/Sample" element={<Sample />} />
          <Route path="/Typography" element={<Typography />} />
          <Route path="/Icon" element={<Icon />} />



        </Routes>
      </Router>
    </div>
  );
}

export default App;
