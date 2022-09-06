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
      <Routes>
        <Route path="/" element={loggedIn ? (
            <Dashboard  loginSetter={callbackFunction} userData={userData} />
          ) : (
            <Form parentCallback={callbackFunction} />
          )} />
          
      </Routes>
    </Router>
  );
};

export default App;
