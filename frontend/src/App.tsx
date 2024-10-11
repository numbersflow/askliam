import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './pages/main';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route 
            path="/" 
            element={<Main />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;