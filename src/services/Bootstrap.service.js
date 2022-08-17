import { apiUrl } from "../config";


const listUsers = () => {
    console.log('listUsers')
    fetch(apiUrl + 'user', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('authToken')
      },
    }).then((response) => response.json())
      .then((data) => {
        console.log('listUsers data', data)
        // data.status && setactiveTask(data.task)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
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
        callback();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }



module.exports =  { listUsers, authenticateLogin }