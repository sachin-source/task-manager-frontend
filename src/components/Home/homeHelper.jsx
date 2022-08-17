import { apiUrl } from "../../config";

const homeHelper = (setTasks, setactiveTask) => {

  const getTasks = () => {
    console.log('getTasks')
    fetch(apiUrl + 'task/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('authToken')
      },
    }).then((response) => response.json())
      .then((data) => {
        console.log('task data', data)
        data.status && setTasks(data.tasks)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };


  const getTask = (taskid) => {
    console.log('getTasks')
    fetch(apiUrl + 'task/' + taskid, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('authToken')
      },
    }).then((response) => response.json())
      .then((data) => {
        console.log('task data', data)
        data.status && setactiveTask(data.task)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const createTask = (taskData) => {
    console.log('getTasks')
    fetch(apiUrl + 'task/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('authToken')
      },
      body : JSON.stringify(taskData)
    }).then((response) => response.json())
      .then((data) => {
        console.log('task data', data);
        data.status && setactiveTask(data.task)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };



  return { getTasks, getTask, createTask }
}

export default homeHelper;