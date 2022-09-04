import React, { useState, useEffect } from "react";

import dashboardHelper from './homeHelper';
import './style.css';

import Modal from 'react-modal';
import { removeNotificationToken } from "../../push-notification";
import BootstrapLoader from '../../services/Bootstrap.service';


const { listUsers } = BootstrapLoader();
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '95vw',
    padding: '4vw'
  },
};

const tabList = [
  { name: 'All-tasks', role: 'all', type: 'ALLTASKS' },
  { name: 'Individual', role: 'admin', type: 'INDIVIDUAL' },
  { name: 'Payment', role: 'admin', type: 'PAYMENT' },
]

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)


const Dashboard = ({ loginSetter, userData }) => {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setactiveTask] = useState(null);
  const [activeTab, setactiveTab] = useState(0);
  const [paymentList, setpaymentList] = useState([]);
  const [notificationPopup, setnotificationPopup] = useState({ display: false, message: "task successful!", status: true });
  const [activePayment, setactivePayment] = useState(null);
  const { getTasks, getTask, createTask, updateTask, getIndividualTasks, notifyUserForTask, getPaymentList, addIn, addOut, updatePayment } = dashboardHelper(setTasks, setactiveTask, setnotificationPopup, setpaymentList, setactivePayment);

  const [isNewTask, setisNewTask] = useState(false);
  const [newTask, setnewTask] = useState({});
  const [users, setusers] = useState();
  const [activeUser, setactiveUser] = useState(undefined);

  const [isModalOpenForTask, setIsModalOpenForTask] = useState(false);
  const [isModalOpenForPayment, setIsModalOpenForPayment] = useState(false);
  const [isAddPayment, setisAddPayment] = useState(false);
  const [isUpdateAddPayment, setisUpdateAddPayment] = useState(false);
  const [isExistingPayment, setisExistingPayment] = useState(false);
  // const [, setIsModalOpenForTask] = useState(false);


  useEffect(() => {
    activeTab === 0 && getTasks();
    Modal.setAppElement('#taskPopup');
    loadUsers();
    setactiveUser(undefined);
    activeTab === 2 && getPaymentList();
    activeTab === 2 && Modal.setAppElement('#paymentPopup');
  }, [activeTab]);

  useEffect(()=>{
    listUsers();
  }, [])

  useEffect(() => {
    [addOutData, addInData] = [{}, {}];
  }, isModalOpenForPayment)

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
    closeModalForTask();
  }

  const updateExistingTask = () => {
    // createTask(tempTask);
    updateTask({ ...activeTask, ...tempTaskToUpdate });
    closeModalForTask();

  }

  const getDate = (dateString) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return (new Date(dateString).getDate() + " " + months[new Date(dateString).getMonth()])
  }

  const isDelayed = (dateString) => {
    return (new Date(dateString).getTime() < new Date().getTime())
  }

  let subtitle;

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
    !isNewTask && (Object.assign(tempTaskToUpdate, ...activeTask))
  }

  function closeModalForTask() {
    setisNewTask(false);
    setIsModalOpenForTask(false);
    for (var entry in tempTask) delete tempTask[entry];
    setactiveTask(null);
    setnewTask(null);
  }

  function closeModalForPayment() {
    setIsModalOpenForPayment(false);
  }

  const openModalPopupForUpdate = (taskId) => {
    setIsModalOpenForTask(true);
    setisNewTask(false);
    getTask(taskId);
  }

  const closeModalForPopup = () => {
    setnotificationPopup({ display: false, message: "", status: false })
  }

  const openModalPopupForCreate = () => {
    loadUsers();
    setIsModalOpenForTask(true);
    setisNewTask(true);
  }

  const PopupInterface = ({ taskData, onChange, close }) => {
    return (<div className="update-popup">
      <div className="popup-header">
        <h4>{taskData?.name}</h4>
        <span className="popup-close-button button" onClick={close} disabled={isNewTask && (!(tempTask.name && tempTask.assignee))}>{isNewTask ? 'Create' : 'Update'}</span>
      </div>
      <div className="task-body-container">
        <div className="element-section">
          <label htmlFor="task-name" className="popup-input-field-label">Title</label>
          <span className="popup-input-field">
            <input type="text" name="name" id="task-name" defaultValue={taskData?.name} placeholder={"Title of the task"} onChange={onChange} disabled={userData?.role != 'admin'} required />
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

  const AllTasksTab = () => {
    return (
      <>
        {userData?.role == 'admin' && (<div className="new-task-button-container">
          <span className="button" onClick={() => openModalPopupForCreate(true)}>New +</span>
        </div>)}

        <TaskListTable taskList={tasks} />

      </>
    )
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

  let addInData = {};
  const onAddInChange = (event) => {
    addInData = { ...addInData, [event.target.name]: event.target.value };
  };

  let addOutData = {};
  const onAddOutChange = (event) => {
    addOutData = { ...addOutData, [event.target.name]: event.target.value };
  }

  let updatePaymentData = {};
  const onUpdatePaymentChange = (e) => {
    let temp = Object.assign(updatePaymentData, { [e.target.name]: (e.target.type == 'checkbox' ? e.target.checked : (e.target.type == 'number' ? +e.target.value : e.target.value)) });
    // updatePaymentData = { ...updatePaymentData, [event.target.name]: event.target.value };
    // setactivePayment({...activePayment, ...updatePaymentData})
  };

  const updateCurrentPayment = () => {
    updatePayment({...activePayment, ...updatePaymentData});
    setIsModalOpenForPayment(false);
    // setactivePayment(null);
  }

  const addInSave = () => {
    addIn({ ...addInData });
    setIsModalOpenForPayment(false);
  }

  const addOutSave = () => {
    addOut({ ...addOutData });
    setIsModalOpenForPayment(false);
  }

  const PaymentTab = () => {
    return (
      <>
      <div className="payment-container">
        <table className="payment-table">
          <thead>
            <tr className="payment-headings">
              <th className="payment-description"></th>
              <th className="payment-In">In</th>
              <th className="payment-Out">Out</th>
            </tr>
          </thead>

          {paymentList.length && (<tbody>
            {paymentList.map((paymentData, index) => (
              <tr key={index} className={"payment-row payment-" + (paymentData.paymentType.trim()) + "-container"} onClick={() => openUpdatePaymentPopup(paymentData.paymentType == 'in', paymentData._id)} >
                <td className="payment-description">
                  <div className="payment-description-title">{getDate(paymentData.paidDate) + ", " + (paymentData.paymentType == 'in' ? "from " + paymentData.senderParty : "to " + paymentData.receiverParty)}</div>
                  <div className="payment-description-body">{paymentData.description}</div>
                </td>
                <td className="payment-In"> {paymentData.paymentType == 'in' ? ("₹" + paymentData.amount) : ""} </td>
                <td className="payment-Out"> {paymentData.paymentType == 'out' ? ("₹" + paymentData.amount) : ""} </td>
              </tr>
            ))}

          </tbody>)
          }
        </table>
      </div>
      <footer className="bottom-footer">
          <div className="payment-footer-container">
            <span className="payment-footer-button payment-in" onClick={addInPayment}>+ in</span>
            <span className="payment-footer-button payment-out" onClick={addOutPayment}>- out</span>
          </div>
      </footer>
      </>
    )
  }

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

  const appDescription = "consultants";
  const getActiveTabIndex = (tab) => {
    return tabList.findIndex((tabdata) => tabdata.type == tab.type)
  }

  const addInPayment = () => {
    setisAddPayment(true);
    setisExistingPayment(false);
    setIsModalOpenForPayment(true);
  }
  
  const addOutPayment = () => {
    setisAddPayment(false);
    setisExistingPayment(false);
    setIsModalOpenForPayment(true);
  }
  
  const openUpdatePaymentPopup = (isInStatus, _id) => {
    setactivePayment(paymentList.find(paymentData => paymentData._id == _id));
    
    setisExistingPayment(true);
    setisUpdateAddPayment(isInStatus);
    setIsModalOpenForPayment(true);
  }

  const AddInInterface = () => {
    return (
      <div className="add-interface">
        <div className="title-container">
          <h4>{isAddPayment ? "Recieved" : "Paid"}</h4>
        </div>
        <div className="party-info">
          <div className="partyname">
            {isAddPayment && <input type="text" name="senderParty" id="partyname" placeholder="Party name *" defaultValue="" onChange={isAddPayment ? onAddInChange : onAddOutChange} required />}
            {!isAddPayment && <input type="text" name="receiverParty" id="partyname" placeholder="Party name *" defaultValue="" onChange={isAddPayment ? onAddInChange : onAddOutChange} required />}
          </div>
          <div className="date-picker">
            <input type="date" name="paidDate" onChange={isAddPayment ? onAddInChange : onAddOutChange} />
          </div>
          <div className="amount-recieved">
            <input type="number" name="amount" placeholder="Amount Received *" onChange={isAddPayment ? onAddInChange : onAddOutChange} required />
          </div>
          <div className="description">
            <input type="text" name="description" placeholder="Description *" onChange={isAddPayment ? onAddInChange : onAddOutChange} required />
          </div>
          <div className="save-button-container">
            {isAddPayment && <span className="save-button" onClick={addInSave}>SAVE</span>}
            {!isAddPayment && <span className="save-button" onClick={addOutSave}>SAVE</span>}
          </div>
        </div>
      </div>
    )
  }

  const UpdatePaymentInterface = () => {
    return (
      <div className="add-interface">
        <div className="party-info">
          <div className="partyname">
            {<input type="text" name="senderParty" id="partyname" placeholder="Party name *" defaultValue={activePayment.paymentType == 'in' ? activePayment.senderParty : activePayment.receiverParty} onChange={onUpdatePaymentChange} required />}
          </div>
          <div className="date-picker">
            <input type="date" name="paidDate" onChange={onUpdatePaymentChange} defaultValue={activePayment.paidDate} />
          </div>
          <div className="amount-recieved">
            <input type="number" name="amount" placeholder="Amount Received *" onChange={onUpdatePaymentChange} defaultValue={activePayment.amount} required />
          </div>
          <div className="description">
            <input type="text" name="description" placeholder="Description *" onChange={onUpdatePaymentChange} defaultValue={activePayment.description} required />
          </div>
          <div className="save-button-container">
            {<span className="save-button" onClick={updateCurrentPayment}>Update</span>}
          </div>
        </div>
      </div>
    )
  }

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
          {tabList.filter((tab) => (tab.role == userData?.role) || (tab.role == 'all')).map((tab, index) => (
            <span className={"tabname " + (getActiveTabIndex(tab) === activeTab ? "activeTab" : "inactiveTab")} key={index} onClick={() => setactiveTab(getActiveTabIndex(tab))}>{tab.name} </span>
          ))}
        </div>

        {(activeTab == 0) && <AllTasksTab />}
        {(activeTab == 1) && <IndividualTasksTab />}
        {(activeTab == 2) && <PaymentTab />}
      </div>
      {/* <footer className="bottom-footer">
        {(activeTab == 2) && (
          <div className="payment-footer-container">
            <span className="payment-footer-button payment-in" onClick={addInPayment}>+ in</span>
            <span className="payment-footer-button payment-out" onClick={addOutPayment}>- out</span>
          </div>
        )}
      </footer> */}

      <div id="taskPopup"></div>
      <div id="paymentPopup"></div>

      <Modal
        isOpen={isModalOpenForTask}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModalForTask}
        style={customStyles}
        contentLabel="Task popup"
      >
        {isNewTask && (<PopupInterface taskData={newTask} onChange={setValuesForTask} close={saveNewTask} />)}
        {!isNewTask && (<PopupInterface taskData={activeTask} onChange={setValuesToUpdateTask} close={updateExistingTask} />)}
      </Modal>
      <Modal
        isOpen={isModalOpenForPayment}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModalForPayment}
        style={customStyles}
        contentLabel="Payment popup"
      >
        {isExistingPayment ? (<UpdatePaymentInterface />) : (<AddInInterface />)}
      </Modal>
      <Modal
        isOpen={!!(notificationPopup?.display)}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModalForPopup}
        style={customStyles}
        contentLabel="Notification popup"
      >
        <div className={(notificationPopup.status ? "success" : "failure") + "-notification notification-popup"} > {notificationPopup.message} </div>
      </Modal>
    </div>
  );
}

export default Dashboard;