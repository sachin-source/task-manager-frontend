import React, { useState, useEffect } from "react";

import dashboardHelper from './homeHelper';
import './style.css';

const Dashboard = ({ loginSetter, userData }) => {
  const [tasks, setTasks] = useState([])
  const [activeTab, setactiveTab] = useState(0)
  const { getTasks } = dashboardHelper(setTasks);
  useEffect(() => {
    getTasks();
  }, [activeTab])

  const signout = () => {
    loginSetter(false);
    localStorage.clear()
  }
  return (
    <div className="home-page" >
      <header>
        <h2>TASKI</h2>
        <p className="button" onClick={signout}>sign out</p>
      </header>
      <div className="task-list-container">

        <div className="tab-container">
        {['All-tasks', 'Individual'].map((tab, index) => (
          <span className={"tabname " + (index === activeTab? "activeTab" : "inactiveTab")}  key={index} >{tab} </span>
          ))}
          </div>
        {
          tasks.map((task, index) => (
            <div className="task-container" key={index}>
              <div className="task-title-row">
                <h2>{task.name}  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe, vitae, mollitia quia laudantium iusto ipsam odio quidem dolorum, accusantium perspiciatis eum vel! Eius atque minima perferendis sapiente, ipsum voluptas eligendi.</h2>
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
      </div>
    </div>
  );
}

export default Dashboard;
