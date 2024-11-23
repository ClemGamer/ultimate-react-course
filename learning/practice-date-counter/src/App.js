import { useState } from "react";

function App() {
  return (
    <div className="App">
      <Counter />
    </div>
  );
}

function Counter() {
  const [dayStep, setDayStep] = useState(1);
  const [dayCount, setDayCount] = useState(0);

  function handleSliderChange(num) {
    // console.log(num);
    setDayStep(num);
  }

  function handleCountChange(count) {
    setDayCount(count);
  }

  function handleResetClick() {
    setDayStep(1);
    setDayCount(0);
  }

  let today = new Date();
  today.setDate(today.getDate() + dayCount);
  let todayMessage = `Today is ${today.toDateString()}`;
  if (dayCount > 0) {
    todayMessage = `${dayCount} days from today is ${today.toDateString()}`;
  } else if (dayCount < 0) {
    todayMessage = `${Math.abs(dayCount)} days ago was ${today.toDateString()}`;
  }

  return (
    <>
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={dayStep}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
        />
        <span>{dayStep}</span>
      </div>
      <div className="counter">
        <button onClick={() => setDayCount((c) => c - dayStep)}>-</button>
        <input
          type="number"
          value={dayCount}
          onChange={(e) => handleCountChange(Number(e.target.value))}
        />
        <button onClick={() => setDayCount((c) => c + dayStep)}>+</button>
      </div>
      <p>{todayMessage}</p>
      {dayStep === 1 && dayCount === 0 ? null : (
        <button onClick={handleResetClick}>reset</button>
      )}
    </>
  );
}

export default App;
