import { useState } from "react";

const percentageOptions = [
  {
    id: 0,
    text: "",
    percentage: 0,
  },
  {
    id: 1,
    text: "",
    percentage: 10,
  },
  {
    id: 2,
    text: "",
    percentage: 20,
  },
  {
    id: 3,
    text: "",
    percentage: 30,
  },
];

function App() {
  const [bill, setBill] = useState(0);

  function handleInputBill(num) {
    setBill(num);
  }

  const [likePercentage, setLikePercentage] = useState(0);
  const [friendLikePercentage, setFriendLikePercentage] = useState(0);

  function handleSelectLikePercentage(num) {
    setLikePercentage(num);
  }

  function handleSelectFriendLikePercentage(num) {
    setFriendLikePercentage(num);
  }

  const tip = Math.round(
    (bill * ((likePercentage + friendLikePercentage) / 2)) / 100
  );
  const total = bill + tip;
  const output = `You pay $${total} ($${bill} + $${tip} tip)`;

  function handleReset() {
    setBill(0);
    setLikePercentage(0);
    setFriendLikePercentage(0);
  }

  return (
    <div className="app">
      <NumberInput
        text="How much was the bill?"
        value={bill}
        onInputNumber={handleInputBill}
      />
      <PercentageSelection
        text="How did you like the service?"
        options={percentageOptions}
        value={likePercentage}
        onSelectPercentage={handleSelectLikePercentage}
      />
      <PercentageSelection
        text="How did your friend like the service?"
        options={percentageOptions}
        value={friendLikePercentage}
        onSelectPercentage={handleSelectFriendLikePercentage}
      />
      <Output text={output} />
      <Button text="reset" onClick={handleReset} />
    </div>
  );
}

function NumberInput({ text, value, onInputNumber }) {
  console.log("NumberInput");
  return (
    <div className="input-question">
      <p>{text}</p>
      <input
        type="number"
        value={value}
        onChange={(e) => onInputNumber(Number(e.target.value))}
      />
    </div>
  );
}

function PercentageSelection({ text, options, value, onSelectPercentage }) {
  return (
    <div className="percentage-selection">
      <p>{text}</p>
      <select
        value={value}
        onChange={(e) => onSelectPercentage(Number(e.target.value))}
      >
        {options.map((option) => (
          <option key={option.id} value={option.percentage}>
            {option.text} ({option.percentage}%)
          </option>
        ))}
      </select>
    </div>
  );
}

function Output({ text }) {
  return <p className="output">{text}</p>;
}

function Button({ text, onClick }) {
  return <button onClick={onClick}>{text}</button>;
}

export default App;
