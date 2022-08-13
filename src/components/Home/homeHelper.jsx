const homeHelper = (setTasks) => {

  const getTasks = () => {
    console.log('getTasks')
    fetch('http://localhost:3005/task/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('authToken')
      },
    }).then((response) => response.json())
      .then((data) => {
        console.log('task data', data)
        setTasks(data)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const signout = () => {
    localStorage.clear();
  }
  
  return { getTasks, signout }
}

export default homeHelper;