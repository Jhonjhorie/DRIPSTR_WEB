import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Artists from '../View/Artists';
import ArtistPage from '../View/ArtistPage';
 
const ArtistsPage_Controller = () => {
  return (
    <Routes>
      <Route path="/artists" element={<Artists />} />
      <Route path="/artistPage/:id" element={<ArtistPage />} />
    </Routes>
  );
};

export default ArtistsPage_Controller;
