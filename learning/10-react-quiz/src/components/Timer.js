import { useEffect } from "react";
import { useQuiz } from "../contexts/QuizContext";

function Timer() {
  const { tick, secondsRemaining } = useQuiz();

  useEffect(
    function () {
      const t = setInterval(function () {
        tick();
      }, 1000);
      return function () {
        clearInterval(t);
      };
    },
    [tick]
  );
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = Math.floor(secondsRemaining % 60);
  return (
    <div className="timer">{`${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`}</div>
  );
}

export default Timer;
