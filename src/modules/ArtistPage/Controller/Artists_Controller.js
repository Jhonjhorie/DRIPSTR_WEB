import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Artists from '../View/Artists';
import ArtistPage from '../View/ArtistPage';
import Topartist from '../View/Topartist';


const ArtistsPage_Controller = () => {
  return (
    <Routes>
      <Route path="/artists" element={<Artists />} />
      <Route path="/artistPage/:id" element={<ArtistPage />} />
      <Route path="/topArtist" element={<Topartist />} />
    </Routes>
  );
};

export default ArtistsPage_Controller;
