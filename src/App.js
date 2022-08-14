import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Form from "./components/Form/Form";
import Dashboard from "./components/Home/Dashboard";

import { askForPermissionToReceiveNotifications } from './push-notification';


const App = () => {
  const [loggedIn, setloggedIn] = useState(false);
  const [userData, setuserData] = useState({});

  function callbackFunction(childData) {
    setloggedIn(childData);
  }

  useEffect(() => {
    setuserData(JSON.parse(localStorage.getItem('userData')))
  }, [loggedIn])
  
  return (
    <Router>
      {/* <button onClick={askForPermissionToReceiveNotifications} >
          Click to receive notifications
        </button> */}
      <Routes>
        <Route path="/Dashboard" element={loggedIn ? <Dashboard  loginSetter={callbackFunction} userData={userData} /> : <Navigate to="/" />} />
        <Route path="/" element={loggedIn ? (
            <Navigate to="/Dashboard" />
          ) : (
            <Form parentCallback={callbackFunction} />
          )} />
      </Routes>
    </Router>
  );
};

export default App;
