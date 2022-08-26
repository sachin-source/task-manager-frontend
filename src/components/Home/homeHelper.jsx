import { apiUrl } from "../../config";

const homeHelper = (setTasks, setactiveTask, setnotificationPopup) => {

  const success = (message = "task successful!") => {
    setnotificationPopup({status : true, message});
    setInterval(setnotificationPopup, 10000, {status : false, message : ""});
  }


  const getTasks = () => {
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

  const getIndividualTasks = (email) => {
    fetch(apiUrl + 'task/individual' + "?assignee=" + email, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('authToken')
      },
    }).then((response) => response.json())
      .then((data) => {
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
        getTasks();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const updateTask = (taskData) => {
    console.log('updateTask')
    fetch(apiUrl + 'task/' + taskData._id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('authToken')
      },
      body : JSON.stringify(taskData)
    }).then((response) => response.json())
      .then((data) => {
        console.log('task data', data)
        getTasks();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const notifyUserForTask = (taskId) => {
    console.log(taskId)
    fetch(apiUrl + 'task/notify/' + taskId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('authToken')
      },
    }).then((response) => response.json())
      .then((data) => {
        console.log('task data', data)
        getTasks();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const getPaymentList = (setpaymentList) => {
    fetch(apiUrl + 'payment/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('authToken')
      },
    }).then((response) => response.json())
      .then((data) => {
        setpaymentList(data?.paymentList);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const addIn = (paymentData) => {
    fetch(apiUrl + 'payment/in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('authToken')
      },
      body : JSON.stringify(paymentData)
    }).then((response) => response.json())
      .then((data) => {
        console.log(data);
        success("succs")
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };



  return { getTasks, getTask, createTask, updateTask, getIndividualTasks, notifyUserForTask, getPaymentList, addIn };
}

export default homeHelper;