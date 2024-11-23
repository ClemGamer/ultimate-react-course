import { useQuiz } from "../contexts/QuizContext";

function NextButton() {
  const { answer, index, questions, nextQuestion, finish } = useQuiz();
  const numQuestions = questions.length;

  if (answer === null) return null;

  if (index < numQuestions - 1) {
    return (
      <button className="btn btn-ui" onClick={nextQuestion}>
        Next
      </button>
    );
  }

  return (
    <button className="btn btn-ui" onClick={finish}>
      Finish
    </button>
  );
}

export default NextButton;
