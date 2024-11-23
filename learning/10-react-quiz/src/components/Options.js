import { useQuiz } from "../contexts/QuizContext";

function Options() {
  const { currentQuestion: question, answer, newAnswer } = useQuiz();

  const hasAnswered = answer !== null;

  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          key={option}
          className={`btn btn-option ${answer === index ? "answer" : ""} ${
            hasAnswered
              ? question.correctOption === index
                ? "correct"
                : "wrong"
              : ""
          }`}
          onClick={() => newAnswer(index)}
          disabled={hasAnswered}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
