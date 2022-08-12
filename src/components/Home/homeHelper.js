import { useState, useEffect } from "react";

const useForm = (callback, validate) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getTasks = () => {
    fetch('http://localhost:3005/task/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': authToken
      },
    }).then((response) => response.json())
      .then((data) => {
        console.log('task data')
        callback();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  
  return { getTasks }
}