import { useState, useEffect } from "react";

const useForm = (callback, validate) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback();
      fetch('http://localhost:3005/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then((data) => {
          if(data?.auth){
            console.log(data?.auth, data?.authToken);
            localStorage.setItem("authToken", data?.authToken);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [errors]);

  const handleSubmit = event => {
    if (event) event.preventDefault();
    setErrors(validate(values));
    setIsSubmitting(true);
  };

  const handleChange = event => {
    event.persist();
    setValues(values => ({
      ...values,
      [event.target.name]: event.target.value
    }));
  };

  const authenticateLogin = () => {
    const authToken = localStorage.getItem('authToken');
    fetch('http://localhost:3005/auth', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authToken' : authToken
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('auth response', data)
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  }

  return {
    handleChange,
    handleSubmit,
    authenticateLogin,
    values,
    errors
  };
};

export default useForm;
