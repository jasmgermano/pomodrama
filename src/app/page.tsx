'use client';
import Image from "next/image";
import Logo from "@/../public/images/logos/pomodrama.png";
import RedLogo from "@/../public/images/logos/pomodrama-red.png";
import PinkStar from "@/../public/images/pinkstar.png";
import RedStar from "@/../public/images/redstar.png";
import { useEffect, useRef, useState } from "react";

type Task = {
  name: string;
  completed: boolean;
};

export default function Home() {
  return (
    <div className="container">
      <aside className={`sidebar ${modeClass}`}>
        <h1>to-do</h1>
        <div className="tasks">
          {tasks.map((item, key) =>
            <div className="task" key={`${item.name}-${key}`}>
              <input type="checkbox" checked={item.completed} onChange={() => handleToggleTask(key)} />
              <span className="task-text">{item.name}</span>
            </div>
          )}
        </div>
        <form onSubmit={handleAddTask}>
          <input type="text" className="task-input" placeholder="adicionar tarefa" onChange={handleChangeTaskInput} value={taskItem} />
        </form>
      </aside>
      <main>
        <div className="logo">
          <Image className="logo-image" src={isCleanMode ? Logo : RedLogo} alt="logo" />
        </div>
        <div className="content">
          <div className={`timer ${modeClass}`}>
            <h1>{Math.floor(timer / 60).toString().padStart(2, "0")}:{String(timer % 60).padStart(2, "0")}</h1>
            <p className="motivation">
              { isBreak ? breakMessage : motivationMessage }
            </p>
            <div className="timer-btn-container">
              <button className={`restart-btn ${modeClass}`} onClick={handleRestartTimer}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><g clipPath="url(#solarRestartBroken0)"><path stroke={isCleanMode ? "#2f2c35" : "#feb3ba"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.729 10.929A8.003 8.003 0 0 1 8.5 20.197M18.363 8.05l-.707-.707A8 8 0 0 0 5.754 18m12.61-9.95h-4.243m4.243 0V3.809"/></g><defs><clipPath id="solarRestartBroken0"><path fill="#fff" d="M0 0h24v24H0z"/></clipPath></defs></g></svg>
              </button>
              <button className={`start-btn ${modeClass}`} onClick={() => handleStartTimer()}>
                {!isRunning ? 
                  <div className="start-btn-content">
                      <img src="/images/start.png" alt="start" />
                      <span>começar</span>
                  </div>
                  :
                  <div className="start-btn-content">
                    <img src="/images/pause.png" alt="pause" />
                    <span>pausar</span>
                  </div>
                }
              </button>
            </div>
          </div>
          <div className="tasks-finished">
            <div className={`tasks-amount ${modeClass}`}>
              <span className={`amount ${modeClass}`}>{tasks.filter(task => task.completed).length}/{tasks.length}</span>
            </div>
            <span className="tasks-finished-text"></span>
          </div>
          <div className="mode">
            <div >
              <label htmlFor="theme-toggle" className="switch">
                <input id="theme-toggle" type="checkbox" defaultChecked={false} onChange={handleToggleTheme} />
                <div className="slider">
                  <Image className="star" src={isCleanMode ? PinkStar : RedStar} alt="pink star with a happy face" />
                </div>
              </label>
                
            </div>
            <span className="mode-text">modo clean</span>
          </div>
        </div>
      </main>
    </div>
  );
}
