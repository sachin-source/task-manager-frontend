import { useState, useEffect } from "react";
import { apiUrl } from "../../config";
import BootstrapLoader from '../../services/Bootstrap.service';


const { listUsers } = BootstrapLoader();


const useForm = (callback, validate) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      fetch(apiUrl + 'user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data?.auth) {
            localStorage.setItem("authToken", data?.authToken);
            authenticateLogin()
            callback();
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
    fetch(apiUrl + 'auth/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': authToken
      },
    }).then((response) => response.json())
      .then((data) => {
        localStorage.setItem('userData', JSON.stringify(data))
        listUsers();
        callback();
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
