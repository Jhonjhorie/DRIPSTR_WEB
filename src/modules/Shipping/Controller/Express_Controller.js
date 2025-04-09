import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Jnt from "./../Express";
import JntDetailed from "./../ExpressDetailed";
import JntTrack from "./../ExpressTrack";
import ExpressLogin from "./../Expresslogin";
import PrivateRoute from "./PrivateRoute";

const JntController = () => {
  return (
    <Routes>
      <Route path="/" element={<ExpressLogin />} />

      <Route element={<PrivateRoute />}>
        <Route path="/dashboard/*" element={<Jnt />} />
        {/* <Route path="/detailed/*" element={<JntDetailed />} />
        <Route path="/track/*" element={<JntTrack />} /> */}
      </Route>
    </Routes>
  );
};

export default JntController;
