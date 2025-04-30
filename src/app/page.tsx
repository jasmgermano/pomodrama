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
  const notificationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [timer, setTimer] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskItem, setTaskItem] = useState("");
  const [isBreak, setIsBreak] = useState(false);
  const [isCleanMode, setIsCleanMode] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const notificationMessages : {clean: string[]; humiliation: string[]} = {
    "clean": [
      "você está fazendo seu melhor e isso é suficiente",
      "você já venceu só por ter começado",
      "persistência > motivação",
      "pequenas ações constroem grandes resultados!",
      "você é capaz de criar a vida que você sonha!",
      "não existe derrota pra quem se esforça",
      "foque no progresso e não na perfeição!",
      "você merece coisas boas"
    ],
    "humiliation": [
      "o sucesso não espera quem procastina",
      "seu máximo é o mínimo de alguém",
      "ou você sofre focando, ou sofre fracassando",
      "o tempo vai passar de todo jeito, mas o seu resultado vai depender do que você faz agora",
      "ou você aumenta o sacrificio ou diminui o sonho",
      "o que a manu cit deve estar fazendo agora?",
      "aposto que a outra tá estudando/trabalhando",
      "a pessoa que você mais odeia deve estar produzindo mais que você hoje!",
      "já olhou seu saldo hoje?",
      'EU DUVIDO você ficar 25 minutos sem usar o celular! (se você pensou "meu pau no seu ouvido" te desejo fracasso)',
    ]
  }

  const handleStartTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
  
    const endTime = Date.now() + timer * 1000; 
  
    setIsRunning(true);
  
    intervalRef.current = setInterval(() => {
      const secondsLeft = Math.round((endTime - Date.now()) / 1000);
  
      if (secondsLeft <= 0) {
        clearInterval(intervalRef.current as NodeJS.Timeout);
        const nextIsBreak = !isBreak;
        const nextDuration = nextIsBreak ? 5 * 60 : 25 * 60;
  
        setIsRunning(false);
        setIsBreak(nextIsBreak);
        setTimer(nextDuration);
  
        const timerElement = document.querySelector(".timer h1") as HTMLElement;
        if (timerElement) {
          timerElement.style.color = nextIsBreak ? "#2f2c35" : "#feb3ba";
        }
  
        return;
      }
  
      setTimer(secondsLeft);
    }, 1000);
  };
  

  const handleRestartTimer = () => {
    if (intervalRef.current)
      clearInterval(intervalRef.current);

    const timerElement = document.querySelector(".timer h1") as HTMLElement;

    if (timerElement) 
      timerElement.style.color = "#feb3ba";

    setTimer(25 * 60);
    setIsRunning(false);
    setIsBreak(false);
  }

  const handleChangeTaskInput = (event: React.ChangeEvent<HTMLElement>) => {
    const value = (event.target as HTMLInputElement).value;

    setTaskItem(value);
  }

  const handleAddTask = (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();

    setTasks([...tasks, { name: taskItem, completed: false }]);
    setTaskItem("");
  }

  const handleToggleTask = (index: number) => {
    const updatedTasks = tasks.map((task, i) => {
      if (i === index) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
  
    setTasks(updatedTasks);
  };

  const handleToggleTheme = () => {
    setIsCleanMode(!isCleanMode);
  }

  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("Este navegador não suporta notificações.");
      return;
    }
  
    if (!isRunning) {
      if (notificationIntervalRef.current) {
        clearInterval(notificationIntervalRef.current);
        notificationIntervalRef.current = null;
      }
      return;
    }
  
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        notificationIntervalRef.current = setInterval(() => {
          const messages = notificationMessages[isCleanMode ? "clean" : "humiliation"];
          const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  
          new Notification("──★˙💌 lembrete", {
            body: randomMessage,
            icon: isCleanMode ? "/images/pinkstar.png" : "/images/redstar.png",
          });
        }, 5 * 60 * 1000); 
      } else if (permission === "denied") {
        console.log("Notificações negadas.");
      }
    });
  
    return () => {
      if (notificationIntervalRef.current) {
        clearInterval(notificationIntervalRef.current);
        notificationIntervalRef.current = null;
      }
    };
  }, [isRunning, isCleanMode]);
  

  useEffect(() => {
    const tasksFinishedTextElement = document.querySelector(".tasks-finished-text") as HTMLElement;
    
    if (tasks.filter(task => task.completed).length == tasks.length && tasks.length > 0) {
      if (tasksFinishedTextElement) {
        tasksFinishedTextElement.innerText = "tasks concluídas! " + (isCleanMode ? " você é incrível!" : "hoje você calou a boca de todo mundo — inclusive a sua própria mente sabotadora!");
      }
    } else {
      tasksFinishedTextElement.innerText = "tasks concluídas! " + (isCleanMode ?  "você está quase lá!" : "kkkkkkkkkkkkkkkkkkkk");
    }
  }, [tasks, isCleanMode]);

  const modeClass = isCleanMode ? "clean" : "humiliation";

  const motivationMessage = isCleanMode 
    ? "cada segundo conta! você é incrível!" 
    : "cada segundo de preguiça é um sonho a menos!";

  const breakMessage = isCleanMode
    ? "você conseguiu! hora de relaxar!"
    : "sobreviveu a 25 minutos sem rolar feed? Uau!";

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
