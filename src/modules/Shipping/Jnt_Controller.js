import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Jnt from './Jnt';
import JntDetailed from './JntDetailed';
import JntTrack from './JntTrack';

const JntController = () => {
  return (
    <Routes>
       <Route path="/*" element={<Jnt />} />
       <Route path="/detailed/*" element={<JntDetailed />} />
       <Route path="/track/*" element={<JntTrack />} />
     
     </Routes>
  );
};

export default JntController;
