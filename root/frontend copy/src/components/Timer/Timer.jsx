import React from "react";
import { useContext, useEffect, useState } from "react";
import "./Timer.css";
import { GlobalContext } from "../../context/GlobalContext";

const Timer = React.memo(() => {
  const [timer, setTimer] = useState({ seconds: 0, minutes: 0, hours: 0 });

  const run = () => {
    setTimer((prevTimer) => {
      const updatedS = prevTimer.seconds + 1;
      const updatedM = prevTimer.minutes + (updatedS === 60 ? 1 : 0);
      const updatedH = prevTimer.hours + (updatedM === 60 ? 1 : 0);
      return {
        seconds: updatedS % 60,
        minutes: updatedM % 60,
        hours: updatedH,
      };
    });
  };

  useEffect(() => {
    const intervalId = setInterval(run, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="timer-container">
      <p>
        {timer.hours < 10 ? "0" + timer.hours : timer.hours}:
        {timer.minutes < 10 ? "0" + timer.minutes : timer.minutes}:
        {timer.seconds < 10 ? "0" + timer.seconds : timer.seconds}
      </p>
    </div>
  );
});

export default Timer;
