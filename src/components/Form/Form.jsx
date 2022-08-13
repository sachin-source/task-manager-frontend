import React, { useState, useEffect } from "react";
import useForm from "./formHelper";
import validate from "./Validation";
import { Navigate } from "react-router-dom";
import "./styles.css"
const Form = props => {
  const { values, errors, handleChange, handleSubmit, authenticateLogin } = useForm( login, validate );
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    authToken && authenticateLogin();
  }, [loggedIn])
  

  function login() {
    setLoggedIn(true);
    props.parentCallback(true);
    return <Navigate to="/default" />;
  }

  return (
    <div className="page">
      {loggedIn && <Navigate to="/default" />}
      <div className="page-container">
        <div className="login-container">
          <div className="box">
            <h1 className="title-primary">Login</h1>
            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                {/* <label className="label">Email Address</label> */}
                <div className="control">
                  <input autoComplete="off" className={`input ${errors.email && "is-danger"}`} type="email"  name="email" onChange={handleChange} value={values.email || ""} placeholder="Enter your email address" required />
                  {errors.email && ( <p className="help is-danger">{errors.email}</p> )}
                </div>
              </div>
              <div className="field">
                {/* <label className="label">Password</label> */}
                <div className="control">
                  <input className={`input ${errors.password && "is-danger"}`} type="password" name="password" onChange={handleChange} value={values.password || ""} placeholder="Your secret password" required />
                </div>
                {errors.password && ( <p className="help is-danger">{errors.password}</p> )}
              </div>
              <div className="button-container">
              <button type="submit" className="button login-button" > Login </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
