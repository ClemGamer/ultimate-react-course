import { useQuiz } from "../contexts/QuizContext";

function FinishScreen() {
  const { points, maxPossiblePoints, highscore, restart } = useQuiz();
  const percentage = Math.ceil((points / maxPossiblePoints) * 100);

  return (
    <>
      <div className="result">
        Your Score {points} / {maxPossiblePoints} ({percentage}%)
      </div>
      <p className="highscore">(Highscore: {highscore} points)</p>
      <button className="btn btn-ui" onClick={() => restart()}>
        Restart
      </button>
    </>
  );
}

export default FinishScreen;
