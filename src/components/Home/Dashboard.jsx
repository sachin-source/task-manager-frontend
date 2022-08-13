import React, { useState, useEffect } from "react";

import dashboardHelper from './homeHelper';
import './style.css';







import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)


const Dashboard = ({ loginSetter, userData }) => {
  const [tasks, setTasks] = useState([])
  const [activeTab, setactiveTab] = useState(0)
  const { getTasks } = dashboardHelper(setTasks);
  useEffect(() => {
    getTasks();
    Modal.setAppElement('#temp');
  }, [activeTab])

  const signout = () => {
    loginSetter(false);
    localStorage.clear()
  }

  const getDate = (dateString) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return (new Date(dateString).getDate() + " " + months[new Date(dateString).getMonth()])
  }





  
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }



  return (
    <div className="home-page" >
      <header className="header-bar">
        <h2>TASKI</h2>
        <p className="signout-button button" onClick={signout}>sign out</p>
      </header>
      <div className="task-list-container">

        <div className="tab-container">
          {['All-tasks', 'Individual'].map((tab, index) => (
            <span className={"tabname " + (index === activeTab ? "activeTab" : "inactiveTab")} key={index} >{tab} </span>
          ))}
        </div>

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
            <tr key={index} className="task-data" >
              <td className="date-label date-label-starts" >{getDate(taskData.createdAt)} </td>
              <td className="task-label">{taskData.name} </td>
              <td className="date-label date-label-ends">{getDate(taskData.deadline || taskData.updatedAt)}</td>
              <td className="progress-label">98%</td>
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







      <button onClick={openModal}>Open Modal</button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2>
        <button onClick={closeModal}>close</button>
        <div>I am a modal</div>
        <form>
          <input />
          <button>tab navigation</button>
          <button>stays</button>
          <button>inside</button>
          <button>the modal</button>
        </form>
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
