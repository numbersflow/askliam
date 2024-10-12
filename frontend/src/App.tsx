import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './pages/main';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // For demonstration purposes

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route 
            path="/" 
            element={
              isLoggedIn ? (
                <Main />
              ) : (
                <div className="flex items-center justify-center h-screen">
                  <p className="text-2xl font-semibold text-gray-700">Please log in</p>
                </div>
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;