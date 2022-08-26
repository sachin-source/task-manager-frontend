import { apiUrl } from "../../config";

const homeHelper = (setTasks, setactiveTask, setnotificationPopup) => {

  const notify = ({message = "task successful!", status}) => {
    setnotificationPopup({display : true, message, status});
    setInterval(setnotificationPopup, 10000, {display : false, message : "", status});
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
        notify({ message : data?.status ? "Task created successfully" : "Error creating the task, Please try later", status : data?.status})
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
        notify({ message : data?.status ? "Task updated Successfully" : "Error updating your task, Please try later", status : data?.status })
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
        notify({message : data.status ? "Payment added successfully" : "Payment could not add, Please add all the requirred parameters", status : data.status})
      })
      .catch((error) => {
        console.error('Error:', error);
        notify({message : "Could not save", status : false})
      });
  };

  return { getTasks, getTask, createTask, updateTask, getIndividualTasks, notifyUserForTask, getPaymentList, addIn };
}

export default homeHelper;