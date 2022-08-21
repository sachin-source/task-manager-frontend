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
  const [activeTab, setactiveTab] = useState(0);
  const { getTasks, getTask, createTask, updateTask, getIndividualTasks, notifyUserForTask } = dashboardHelper(setTasks, setactiveTask, activeTab);

  const [isNewTask, setisNewTask] = useState(false);
  const [newTask, setnewTask] = useState({});
  const [users, setusers] = useState();
  const [activeUser, setactiveUser] = useState(undefined);

  useEffect(() => {
    getTasks();
    Modal.setAppElement('#temp');
    loadUsers();
    setactiveUser(undefined);
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

  const setValuesForTask = (e) => {
    tempTask[e.target.name] = e.target.type == 'checkbox' ? e.target.checked : (e.target.type == 'number' ? +e.target.value : e.target.value);
  }

  const setValuesToUpdateTask = (e) => {
    let temp = Object.assign(tempTaskToUpdate, { [e.target.name]: (e.target.type == 'checkbox' ? e.target.checked : (e.target.type == 'number' ? +e.target.value : e.target.value)) });
  }

  const saveNewTask = () => {
    createTask(tempTask);
    closeModal();
  }

  const updateExistingTask = () => {
    // createTask(tempTask);
    updateTask({ ...activeTask, ...tempTaskToUpdate });
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
    setactiveTask(null);
    setnewTask(null);
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
        <span className="popup-close-button button" onClick={close}  disabled={ isNewTask && ( !(tempTask.name && tempTask.assignee) )  }>{isNewTask ? 'Create' : 'Update'}</span>
      </div>
      <div className="task-body-container">
        <div className="element-section">
          <label htmlFor="task-name" className="popup-input-field-label">Title</label>
          <span className="popup-input-field">
            <input type="text" name="name" id="task-name" defaultValue={taskData?.name} placeholder={"Title of the task"} onChange={onChange} disabled={userData?.role != 'admin'} required/>
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
              {userData?.role == 'admin' ? users.map((userdata, index) => (
                <option key={index} value={userdata.email} selected={taskData?.assignee == userdata?.email}>{userdata.name}</option>
              )) : <option value={taskData?.assignee} selected>{taskData?.assignee}</option>}
            </select>
          </span>
        </div>
        <div className="element-section">
          <label htmlFor="task-assignee" className="popup-input-field-label">progress :</label>
          <span className="popup-input-field">
            <input type="number" name="progress" id="task-status" defaultValue={+taskData?.progress} placeholder={"percentage of completion"} onChange={onChange} />
          </span>
        </div>
        <div className="element-section">
          <label htmlFor="task-priority" className="popup-input-field-label">priority :</label>
          <span className="popup-input-field">
            <input type="checkbox" name="hasPriority" id="task-priority" checked={taskData?.hasPriority} onChange={onChange} disabled={userData?.role != 'admin'} />
            <input type="number" name="priority" id="task-priority" defaultValue={taskData?.priority} placeholder={"priority of the task if any"} onChange={onChange} disabled={userData?.role != 'admin'} />
          </span>
        </div>
        <div className="element-section">
          <label htmlFor="task-deadline" className="popup-input-field-label">deadline :</label>
          <span className="popup-input-field">
            <input type="checkbox" name="hasDeadline" id="task-deadline" checked={taskData?.hasDeadline} onChange={onChange} disabled={userData?.role != 'admin'} />
            <input type="Date" name="deadline" id="task-deadline" defaultValue={taskData?.deadline} placeholder={"deadline of the task if any"} onChange={onChange} disabled={userData?.role != 'admin'} />
          </span>
        </div>
        {!isNewTask && (<div className="element-section ">
          <span className="popup-input-field notify-button" onClick={() => notifyUserForTask(taskData?._id)} ><p>notify again</p></span>
        </div>)}
      </div>
    </div>)
  }

  const AllTasksTab = (() => {
    return (
      <>
        {userData?.role == 'admin' && (<div className="new-task-button-container">
          <span className="button" onClick={() => openModalPopupForCreate(true)}>New +</span>
        </div>)}

        <TaskListTable taskList={tasks} />

      </>
    )
  })

  const TaskListTable = ({ taskList }) => {
    return (
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
          {taskList.map((taskData, index) => (
            <tr key={index} className={"task-data " + (+taskData.progress >= 100 ? "task-completed" : ((taskData.hasDeadline && taskData.deadline && isDelayed(taskData.deadline)) ? "task-delayed" : "task-ontrack"))} onClick={() => openModalPopupForUpdate(taskData._id)} >
              <td className="date-label date-label-starts" >{getDate(taskData.createdAt)} </td>
              <td className="task-label">{taskData.name} </td>
              <td className="date-label date-label-ends">{getDate(taskData.deadline || taskData.updatedAt)}</td>
              <td className="progress-label">{+taskData.progress >= 100 ? 100 : taskData.progress}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  const setIndividualUser = (user) => {
    setactiveUser(user);
    getIndividualTasks(user.email);
  }

  const IndividualTasksTab = () => {
    return (
      <div className="individual-tab" >
        {!activeUser?.email && users.map((user, index) => (
          <span className="individual-user" key={index}>
            <span className="individual-user-name" onClick={() => setIndividualUser(user)}>{user.name}</span>
          </span>
        ))
        }
        <div></div>
        {activeUser?.email && (
          <div className="task-list-container">
            <h4 className="active-user-name">{activeUser.name}</h4>
          <TaskListTable taskList={tasks} />
          </div>
        )}
      </div>
    );
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
            <span className={"tabname " + (index === activeTab ? "activeTab" : "inactiveTab")} key={index} onClick={() => setactiveTab(index)}>{tab} </span>
          ))}
        </div>

        {activeTab == 0 && <AllTasksTab />}
        {activeTab == 1 && <IndividualTasksTab />}
      </div>

      <div id="temp"></div>

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {isNewTask && (<PopupInterface taskData={newTask} onChange={setValuesForTask} close={saveNewTask} />)}
        {!isNewTask && (<PopupInterface taskData={activeTask} onChange={setValuesToUpdateTask} close={updateExistingTask} />)}
      </Modal>
    </div>
  );
}

export default Dashboard;