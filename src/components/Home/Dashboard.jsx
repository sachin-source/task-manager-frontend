import React, { useState, useEffect } from "react";

import dashboardHelper from './homeHelper';
import './style.css';

import Modal from 'react-modal';
import { removeNotificationToken } from "../../push-notification";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '90vw'
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)


const Dashboard = ({ loginSetter, userData }) => {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setactiveTask] = useState(null);
  const [updatingTask, setupdatingTask] = useState(null);
  const [activeTab, setactiveTab] = useState(0);
  const { getTasks, getTask, createTask, updateTask } = dashboardHelper(setTasks, setactiveTask, setupdatingTask);

  const [isNewTask, setisNewTask] = useState(false);
  const [newTask, setnewTask] = useState({});
  const [users, setusers] = useState();

  useEffect(() => {
    getTasks();
    Modal.setAppElement('#temp');
    loadUsers();
  }, [activeTab]);

  const signout = () => {

    removeNotificationToken((err, signedOut) => {
      loginSetter(false);
      localStorage.clear();
          })
  }

  const loadUsers = () => {
    setusers(JSON.parse(localStorage.getItem('users')));
  }

  const tempTask = {};
  const tempTaskToUpdate = {};

  const setValuesForTask = (event) => {
    tempTask[event.target.name] = event.target.value || event.target.checked;
  }
  
  const setValuesToUpdateTask = (e) => {
    let temp = Object.assign(tempTaskToUpdate, { [e.target.name] : e.target.value});
  }

  const saveNewTask = () => {
    createTask(tempTask);
    closeModal();
  }

  const updateExistingTask = () => {
    // createTask(tempTask);
    updateTask({...activeTask, ...tempTaskToUpdate});
    closeModal();

  }

  const getDate = (dateString) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return (new Date(dateString).getDate() + " " + months[new Date(dateString).getMonth()])
  }

  const isDelayed = (dateString) => {
    return (new Date(dateString).getTime() < new Date().getTime())
  }

  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
    !isNewTask && (Object.assign(tempTaskToUpdate, ...activeTask))
  }

  function closeModal() {
    setisNewTask(false);
    setIsOpen(false);
    for (var entry in tempTask) delete tempTask[entry];
  }

  const openModalPopupForUpdate = (taskId) => {
    setIsOpen(true);
    setisNewTask(false);
    getTask(taskId);
  }

  const openModalPopupForCreate = () => {
    loadUsers();
    setIsOpen(true);
    setisNewTask(true);
  }

  const PopupInterface = ({ taskData, onChange, close }) => {
    return (<div className="update-popup">
      <div className="popup-header">
        <h4>{taskData?.name}</h4>
        <span className="popup-close-button button" onClick={close}>{isNewTask ? 'Create' : 'Update'}</span>
      </div>
      <div className="task-body-container">
        <div className="element-section">
          <label htmlFor="task-name" className="popup-input-field-label">Title</label>
          <span className="popup-input-field">
            <input type="text" name="name" id="task-name" defaultValue={taskData?.name} placeholder={"Title of the task"} onChange={onChange}  disabled={userData?.role != 'admin'} />
          </span>
        </div>
        <div className="element-section">
          <label htmlFor="task-assigner" className="popup-input-field-label">Assigned by :</label>
          <span className="popup-input-field">
            <input type="text" name="" id="task-assigner" defaultValue={isNewTask ? 'YOU' : taskData?.assigner} placeholder={"Email of assigned by"} disabled={true} />
          </span>
        </div>
        <div className="element-section">
          <label htmlFor="task-assignee" className="popup-input-field-label">Assigned to :</label>
          <span className="popup-input-field">
            <select type="email" name="assignee" id="task-assignee" defaultValue={taskData?.assignee} placeholder={"Email of assigned to"} onChange={onChange} disabled={userData?.role != 'admin'} >
              {userData?.role == 'admin' && (<option value="Deepak" selected={!taskData?.assignee}>select the assignee</option>)}
              { userData?.role == 'admin' ? users.map((userdata, index) => (
                  <option key={index} value={userdata.email} selected={taskData?.assignee == userdata?.email}>{userdata.name}</option>
                )) : <option  value={taskData?.assignee} selected>{taskData?.assignee}</option> }
            </select>
          </span>
        </div>
        <div className="element-section">
          <label htmlFor="task-assignee" className="popup-input-field-label">progress :</label>
          <span className="popup-input-field">
            <input type="number" name="progress" id="task-status" defaultValue={taskData?.progress} placeholder={"percentage of completion"} onChange={onChange} />
          </span>
        </div>
        <div className="element-section">
          <label htmlFor="task-priority" className="popup-input-field-label">priority :</label>
          <span className="popup-input-field">
            <input type="checkbox" name="hasPriority" id="task-priority" checked={taskData?.hasPriority} onChange={onChange} disabled={userData?.role != 'admin'}/>
            <input type="number" name="priority" id="task-priority" defaultValue={taskData?.priority} placeholder={"priority of the task if any"} onChange={onChange} disabled={userData?.role != 'admin'}/>
          </span>
        </div>
        <div className="element-section">
          <label htmlFor="task-deadline" className="popup-input-field-label">deadline :</label>
          <span className="popup-input-field">
            <input type="checkbox" name="hasDeadline" id="task-deadline" checked={taskData?.hasDeadline} onChange={onChange} disabled={userData?.role != 'admin'}/>
            <input type="Date" name="deadline" id="task-deadline" defaultValue={taskData?.deadline} placeholder={"deadline of the task if any"} onChange={onChange} disabled={userData?.role != 'admin'}/>
          </span>
        </div>
      </div>
    </div>)
  }

  const appDescription = "consultants";

  return (
    <div className="home-page" >
      <header className="header-bar">
        <span>
        <h2>BASAVA</h2>
        {/* <p>consultants</p> */}
        <span className="description-container">
        {appDescription.split("").map((letter) => (
          <span className="letter-space">{letter}</span>
        ))}
        </span>
        </span>
        <span className="signout-button button" onClick={signout}>sign out</span>
      </header>
      <div className="task-list-container">

        <div className="tab-container">
          {['All-tasks', 'Individual'].map((tab, index) => (
            <span className={"tabname " + (index === activeTab ? "activeTab" : "inactiveTab")} key={index} >{tab} </span>
          ))}
        </div>

        {
          userData?.role == 'admin' && (<div className="new-task-button-container">
            <span className="button" onClick={() => openModalPopupForCreate(true)}>New +</span>
          </div>)
        }

        <table className="task-table">
          <thead>
            <tr className="task-headings">
              <th className="date-label date-label-starts">Starts</th>
              <th className="task-label">Task name</th>
              <th className="date-label date-label-ends">Ends</th>
              <th className="progress-label">Progress</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((taskData, index) => (
              <tr key={index} className={"task-data " + (taskData.progress >= 100 ? "task-completed" : ( (taskData.hasDeadline && taskData.deadline && isDelayed(taskData.deadline)) ? "task-delayed" : "task-ontrack"  ))} onClick={() => openModalPopupForUpdate(taskData._id)} >
                <td className="date-label date-label-starts" >{getDate(taskData.createdAt)} </td>
                <td className="task-label">{taskData.name} </td>
                <td className="date-label date-label-ends">{getDate(taskData.deadline || taskData.updatedAt)}</td>
                <td className="progress-label">{taskData.progress}%</td>
              </tr>
            ))}
          </tbody>
          {/* <tr>
            <td>Island Trading</td>
            <td>Helen Bennett</td>
            <td>UK</td>
          </tr> */}
        </table>

      </div>




      <div id="temp"></div>







      {/* <button onClick={openModal}>Open Modal</button> */}
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {/* <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2> */}
        {isNewTask && (<PopupInterface taskData={newTask} onChange={setValuesForTask} close={saveNewTask} />)}
        {!isNewTask && (<PopupInterface taskData={activeTask} onChange={setValuesToUpdateTask} close={updateExistingTask} />)}
      </Modal>
    </div>
  );
}




const legacycode = (tasks, userData) => {
  tasks.map((task, index) => (
    <div className="task-container" key={index}>
      <div className="task-title-row">
        <h2>{task.name} Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quam, praesentium.</h2>
      </div>
      <div className="task-assign-row">
        {userData?.email != task.assigner && <span className="task-assign-container"> <span className="task-assign-title">Assigned by : </span> <span className="task-assign-value"> {task.assigner} </span></span>}
        {userData?.email != task.assignee && <span className="task-assign-container"> <span className="task-assign-title">Assigned to : </span> <span className="task-assign-value"> {task.assignee} </span></span>}
        <span className="task-assign-container"> <span className="task-assign-title">Status </span>
          <select id="cars" className="task-assign-value">
            <option value="volvo">in-progress</option>
            <option value="saab">backlog</option>
            <option value="vw">not started</option>
            <option value="audi" selected>completed</option>
          </select>
        </span>
        {/* {task.hasPriority && <span className="task-assign-container"> <span className="task-assign-title">Priority </span> <span className="task-assign-value"> {task.priority} </span></span>}
        {task.hasDeadline && <span className="task-assign-container"> <span className="task-assign-title">Deadline </span> <span className="task-assign-value"> {task.deadline} </span></span>} */}
      </div>
      {/* <div className="task-description-row">
      {task.description ? (<span className="task-description-container"> <span className="task-assign-title">description </span> <span className="task-assign-value"> {task.description} </span></span> ) : (<span className="no-discription" >No discription available</span> ) }
        <span className="update-button-container" ><i class="fa-solid fa-pen-to-square update-button"></i></span>
      </div> */}
    </div>
  ))
}

export default Dashboard;
