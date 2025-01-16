import React from 'react';
import { publicRoutes } from './routes/routes.jsx'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import './index.css';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        {publicRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={<route.component />}
          />
        ))}
      </Routes>
    </Router>
  );
};

export default App;
