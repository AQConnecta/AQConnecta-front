import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Register from '../pages/Register/Register';
import Error from '../pages/Error/Error';
import Login from '../pages/Login/Login';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='register' element={<Register />} />
        <Route path='login' element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
