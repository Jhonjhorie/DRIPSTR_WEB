import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Artists from '../View/Artists';

 
const ArtistsPage_Controller = () => {
  return (
    <Routes>
      <Route path="/artists" element={<Artists />} />
    </Routes>
  );
};

export default ArtistsPage_Controller;
