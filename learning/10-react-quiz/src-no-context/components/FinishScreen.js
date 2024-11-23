function FinishScreen({ points, maxPossiblePoints, highscore, dispatch }) {
  const percentage = Math.ceil((points / maxPossiblePoints) * 100);

  return (
    <>
      <div className="result">
        Your Score {points} / {maxPossiblePoints} ({percentage}%)
      </div>
      <p className="highscore">(Highscore: {highscore} points)</p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart
      </button>
    </>
  );
}

export default FinishScreen;
