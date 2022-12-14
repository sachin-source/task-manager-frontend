import { apiUrl } from "../../config";

const homeHelper = (setTasks, setactiveTask, setnotificationPopup, setpaymentList, setactivePayment, setpaymentSummary) => {

  const headers = () => {
    return {
      'Content-Type': 'application/json',
      'token': localStorage.getItem('authToken') || ""
    }
  }
  const notify = ({message = "task successful!", status}) => {
    setnotificationPopup({display : true, message, status});
    setInterval(setnotificationPopup, 10000, {display : false, message : "", status});
  }

  const getTasks = () => {
    fetch(apiUrl + 'task/', {
      method: 'GET',
      headers: headers()
    }).then((response) => response.json())
      .then((data) => {
        data.status && setTasks(data.tasks)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const getIndividualTasks = (email) => {
    fetch(apiUrl + 'task/individual' + "?assignee=" + email, {
      method: 'GET',
      headers: headers(),
    }).then((response) => response.json())
      .then((data) => {
        data.status && setTasks(data.tasks)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const getTask = (taskid) => {
    fetch(apiUrl + 'task/' + taskid, {
      method: 'GET',
      headers: headers(),
    }).then((response) => response.json())
      .then((data) => {
        data.status && setactiveTask(data.task)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const createTask = (taskData) => {
    fetch(apiUrl + 'task/new', {
      method: 'POST',
      headers: headers(),
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
    fetch(apiUrl + 'task/' + taskData._id, {
      method: 'PUT',
      headers: headers(),
      body : JSON.stringify(taskData)
    }).then((response) => response.json())
      .then((data) => {
        notify({ message : data?.status ? "Task updated Successfully" : "Error updating your task, Please try later", status : data?.status })
        data?.status && getTasks();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const notifyUserForTask = (taskId) => {
    fetch(apiUrl + 'task/notify/' + taskId, {
      method: 'GET',
      headers: headers(),
    }).then((response) => response.json())
      .then((data) => {
        getTasks();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const getPaymentList = (projectId) => {
    fetch(apiUrl + 'payment/?projectId=' + projectId, {
      method: 'GET',
      headers: headers(),
    }).then((response) => response.json())
      .then((data) => {
        data?.status && setpaymentSummary(data?.calculations)
        data?.status && setpaymentList(data?.paymentList);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  
  const transaction = (isIn,  paymentData) => {
    fetch(apiUrl + 'payment/' + (isIn ? 'in' : 'out'), {
      method: 'POST',
      headers: headers(),
      body : JSON.stringify(paymentData)
    }).then((response) => response.json())
      .then((data) => {
        getPaymentList(paymentData.projectId);
        notify({message : data.status ? "Payment added successfully" : "Payment could not add, Please add all the requirred parameters", status : data.status})
      })
      .catch((error) => {
        console.error('Error:', error);
        notify({message : "Could not save", status : false})
      });
  };

  const updatePayment = (paymentData) => {
    fetch(apiUrl + 'payment/' + paymentData._id, {
      method: 'PUT',
      headers: headers(),
      body : JSON.stringify(paymentData)
    }).then((response) => response.json())
      .then((data) => {
        getPaymentList();
        setactivePayment(null);
        notify({ message : data?.status ? "Transaction updated Successfully" : "Error updating your transaction, Please try later", status : data?.status })
        // getTasks();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const addIn = (paymentData) => {
    return transaction(true, paymentData);
  }

  const addOut = (paymentData) => {
    return transaction(false, paymentData);
  }
  
  const listProjects = (setprojects) => {
    fetch(apiUrl + 'project/', {
      method: 'GET',
      headers: headers()
    }).then((response) => response.json())
      .then((data) => {
        data.status && setprojects(data.projects)
        !data?.status && notify({ message : "Error listing the projects, Please try later", status : false })
      })
      .catch((error) => {
        notify({ message : "Error listing the projects, Please try later", status : false })
      });
  };

  const createProject = (projectData) => {
    fetch(apiUrl + 'project/', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(projectData)
    }).then((response) => response.json())
      .then((data) => {
        !data?.status && notify({ message : "Error creating the project, Please try later", status : false });
      })
      .catch((error) => {
        notify({ message : "Error creating the project, Please try later", status : false });
      });
  };

  return { getTasks, getTask, createTask, updateTask, getIndividualTasks, notifyUserForTask, getPaymentList, addIn, addOut, updatePayment, listProjects, createProject };
}

export default homeHelper;