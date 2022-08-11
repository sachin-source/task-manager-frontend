import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Form from "./components/Form/Form";
import Dashboard from "./components/Home/Dashboard";

const App = () => {
  const [loggedIn, setloggedIn] = useState(false);

  function callbackFunction(childData) {
    setloggedIn(childData);
  }



  return (
    <Router>
      <Routes>
        <Route path="/Dashboard" element={loggedIn ? <Dashboard /> : <Navigate to="/" />} />
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
