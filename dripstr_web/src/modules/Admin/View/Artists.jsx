import react, { useState, useEffect } from 'react'
import Sidebar from './Shared/Sidebar'
import { supabase } from "../../../constants/supabase";



function Artists() {
  return (
    <div>
        <Sidebar />
    </div>
  )
}

export default Artists