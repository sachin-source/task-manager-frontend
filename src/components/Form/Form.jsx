import React, { useState } from "react";
import useForm from "./useForm";
import validate from "./Validation";
import { Navigate } from "react-router-dom";
import "./styles.css"
const Form = props => {
  const { values, errors, handleChange, handleSubmit } = useForm(
    login,
    validate
  );
  const [loggedIn, setLoggedIn] = useState(false);

  function login() {
    setLoggedIn(true);
    props.parentCallback(true);
    return <Navigate to="/default" />;
  }

  return (
    <div className="section is-fullheight">
      {loggedIn && <Navigate to="/default" />}
      <div className="page-container">
        <div className="login-container">
          <div className="box">
            <h1>Login</h1>
            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label className="label">Email Address</label>
                <div className="control">
                  <input autoComplete="off" className={`input ${errors.email && "is-danger"}`} type="email"  name="email" onChange={handleChange} value={values.email || ""} required />
                  {errors.email && ( <p className="help is-danger">{errors.email}</p> )}
                </div>
              </div>
              <div className="field">
                <label className="label">Password</label>
                <div className="control">
                  <input className={`input ${errors.password && "is-danger"}`} type="password" name="password" onChange={handleChange} value={values.password || ""} required />
                </div>
                {errors.password && ( <p className="help is-danger">{errors.password}</p> )}
              </div>
              <button type="submit" className="button is-block is-info is-fullwidth" > Login </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
