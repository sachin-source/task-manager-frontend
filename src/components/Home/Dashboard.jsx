import React, { useState, useEffect } from "react";

import dashboardHelper from './homeHelper';
import './style.css';

const Dashboard = ({ loginSetter, userData }) => {
  const [tasks, setTasks] = useState([])
  const { getTasks } = dashboardHelper(setTasks);
  useEffect(() => {
    getTasks();
  }, [])

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
        {
          tasks.map((task, index) => (
            <div className="task-container" key={index}>
              <div className="task-title-row">
                {/* <p className="task-index">#{index + 1}</p> */}
                <h2>{task.name}  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe, vitae, mollitia quia laudantium iusto ipsam odio quidem dolorum, accusantium perspiciatis eum vel! Eius atque minima perferendis sapiente, ipsum voluptas eligendi.</h2>
              </div>
              {/* <div className="task-assign-row">
                <span> <span className="task-assign-title">assigner : </span> <span className="task-assign-value"> {task.assigner} </span></span>
                <span> <span className="task-assign-title">assignee : </span> <span className="task-assign-value"> {task.assignee} </span></span>
              </div> */}
              <div className="task-assign-row">
                { userData?.email != task.assigner && <span className="task-assign-container"> <span className="task-assign-title">Assigned by : </span> <span className="task-assign-value"> {task.assigner} </span></span> }
                { userData?.email != task.assignee && <span className="task-assign-container"> <span className="task-assign-title">Assigned to : </span> <span className="task-assign-value"> {task.assignee} </span></span> }
                <span className="task-assign-container"> <span className="task-assign-title">Status </span> <span className="task-assign-value"> {task.status} </span></span>
                {task.hasPriority && <span className="task-assign-container"> <span className="task-assign-title">Priority </span> <span className="task-assign-value"> {task.priority} </span></span> }
                {task.hasDeadline && <span className="task-assign-container"> <span className="task-assign-title">Deadline </span> <span className="task-assign-value"> {task.deadline} </span></span> }
                {/* <span className="task-assign-container"> <span className="task-assign-title">Assigned to : </span> <span className="task-assign-value"> {task.assignee} </span></span> */}
              </div>
              {task.description && (<div className="task-description-row">
                <span className="task-description-container"> <span className="task-assign-title">description </span> <span className="task-assign-value"> {task.description} </span></span>
              </div>)}
              {/* <div className="task-assign-row">
                <span > assigned by :   <span className="button">{task.assigner}</span> </span>
                <span className="button button-disabled">assigned to :  {task.assignee} </span>
              </div> */}
              {/* <span>{task.deadline}</span>
              <span>{task.status}</span>
              <span>{task.priority}</span>
              <span>{task.description}</span> */}
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Dashboard;
