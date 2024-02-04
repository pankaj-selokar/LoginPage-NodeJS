import React from 'react';
import background2 from './images/background2.jpg';
import RegistrationForm from './RegistrationForm';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Dashboard from './Dashboard';
import Login from './Login';
import { ToastContainer } from 'react-toastify';

const App = () => {

  

  return (
    <Router>
      <div className="background-container" style={{ backgroundImage: `url(${background2})`, height: '100vh', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Routes>
          <Route
            path="/"
            element={<Login/>}
          />
          <Route path="/signup" element={<RegistrationForm  />} />
          <Route path='/dashboard' element={<Dashboard/>}/>
        </Routes>
        
      <ToastContainer />
      </div>
    </Router>

  );
};

export default App;

