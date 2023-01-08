import { Route, Routes } from "react-router-dom";
import Input from "./pages/Input";
import Master from "./components/Master";
import {useEffect,useState} from "react"
import io from "socket.io-client";
import config from "./config.json"
const socket = io.connect("http://"+config.ip_address+":3001");

function App() {
  
  return (
    <div>
      {/* <Navigation /> */}
      
      <Routes>
      <Route path="/"  element={<Master socket={socket} config={config} tablename="material" />} />
        <Route path="/input" element={<Input />} />
      </Routes>
      
    </div>
  );
}

export default App;
