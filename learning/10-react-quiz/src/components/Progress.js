import { useQuiz } from "../contexts/QuizContext";

function Progress() {
  const { questions, index, points, maxPossiblePoints } = useQuiz();
  const numQuestions = questions.length;

  return (
    <header className="progress">
      <progress max={numQuestions} value={index} />
      <p>
        Question <strong>{index + 1}</strong> / {numQuestions}
      </p>
      <p>
        Points <strong>{points}</strong> / {maxPossiblePoints}
      </p>
    </header>
  );
}

export default Progress;
