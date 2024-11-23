import { createContext, useContext, useReducer, useEffect } from "react";

const SECS_PER_QUESTION = 30;

const initialState = {
  // 'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",
  questions: [],
  index: 0,
  currentQuestion: null,
  answer: null,
  points: 0,
  maxPossiblePoints: 0,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      const maxPossiblePoints = action.payload.reduce(
        (prev, cur) => prev + cur.points,
        0
      );
      return {
        ...state,
        questions: action.payload,
        currentQuestion: action.payload[0],
        status: "ready",
        maxPossiblePoints,
      };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          question.correctOption === action.payload
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      const index = state.index++;
      return {
        ...state,
        index,
        currentQuestion: state.questions[index],
        answer: null,
      };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        currentQuestion: state.questions[0],
        status: "ready",
        highscore: state.highscore,
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    case "rejected":
      return {
        ...state,
        status: "error",
      };
    default:
      throw new Error(`Unknow action: ${action.type}`);
  }
}

const QuizContext = createContext();

function QuizProvider({ children }) {
  const [
    {
      status,
      questions,
      currentQuestion,
      index,
      answer,
      points,
      maxPossiblePoints,
      highscore,
      secondsRemaining,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  useEffect(function () {
    fetch("http://localhost:3001/questions")
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "dataReceived", payload: data });
      })
      .catch((err) => dispatch({ type: "rejected" }));
  }, []);

  function start() {
    dispatch({ type: "start" });
  }

  function newAnswer(index) {
    dispatch({ type: "newAnswer", payload: index });
  }

  function nextQuestion() {
    dispatch({ type: "nextQuestion" });
  }

  function finish() {
    dispatch({ type: "finish" });
  }

  function restart() {
    dispatch({ type: "restart" });
  }

  function tick() {
    dispatch({ type: "tick" });
  }

  return (
    <QuizContext.Provider
      value={{
        status,
        questions,
        currentQuestion,
        index,
        answer,
        points,
        maxPossiblePoints,
        highscore,
        secondsRemaining,
        start,
        newAnswer,
        nextQuestion,
        finish,
        restart,
        tick,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error("QuizContext was used outside of QuizProvider");
  return context;
}

export { QuizProvider, useQuiz };
