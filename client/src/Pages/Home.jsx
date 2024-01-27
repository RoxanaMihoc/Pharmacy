// src/components/Login.js

import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import Menu from '../Components/Menu'
import Gallery from '../Components/Gallery';
import ProductList from '../Components/ProductList';
import SecondaryMenu from "../Components/SecondMenu";


const Home = () => {
  const { token, logout } = useAuth();

  if (!token) {
    // Redirect or show a message for unauthenticated users
    return <p>You are not authenticated. Please log in.</p>;
  }

  return (
    <div>
      <Menu />
      <SecondaryMenu />
      <Gallery/>
      <ProductList/>
      <h2>Welcome to the Home Page!</h2>
      <p>Your JWT token: {token}</p>
      <button onClick={logout}>Logout</button>
      {/* Your home page content */}
    </div>
  );
};

export default Home;
