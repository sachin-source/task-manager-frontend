import { apiUrl } from "../config";

const BootStrapServices = () => {
  const headers = () => {
    return {
      'Content-Type': 'application/json',
      'token': localStorage.getItem('authToken')
    }
  }
  const listUsers = () => {
    fetch(apiUrl + 'user', {
      method: 'get',
      headers: headers()
    }).then((response) => response.json())
      .then((data) => {
        data?.users?.length && localStorage.setItem('users', JSON.stringify(data.users))
        // data.status && setactiveTask(data.task)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const authenticateLogin1 = () => {
    const authToken = localStorage.getItem('authToken');
    fetch(apiUrl + 'auth/', {
      method: 'GET',
      headers: headers()
    }).then((response) => response.json())
      .then((data) => {
        localStorage.setItem('userData', JSON.stringify(data))
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  return { listUsers, authenticateLogin1 }

}


export default BootStrapServices;