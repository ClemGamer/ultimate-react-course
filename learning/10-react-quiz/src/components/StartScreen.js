import { useQuiz } from "../contexts/QuizContext";

function StartScreen() {
  const { questions, start } = useQuiz();
  const numQuestions = questions.length;

  return (
    <div className="start">
      <h2>Welcome to The React Quiz!</h2>
      <h3>{numQuestions} questions to test your React mastery</h3>
      <button className="btn btn-ui" onClick={start}>
        Let's Start
      </button>
    </div>
  );
}

export default StartScreen;
