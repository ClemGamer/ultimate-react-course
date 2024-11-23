// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import { useEffect, useState } from "react";

const currencies = ["USD", "EUR", "CAD", "INR"];

export default function App() {
  const [originCurrency, setOriginCurrency] = useState("USD");
  const [convertedCurrency, setConvertedCurrency] = useState("EUR");
  const [amount, setAmount] = useState(0);
  const [rate, setRate] = useState(0);

  function handleInputValue(e) {
    const v = Number(e.target.value);
    if (Number.isNaN(v)) {
      return;
    }
    setAmount(v);
  }

  useEffect(
    function () {
      const controller = new AbortController();
      async function convertCurrency() {
        if (!amount) {
          setRate(0);
          return;
        }
        if (originCurrency === convertedCurrency) {
          setRate(amount);
          return;
        }
        try {
          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${amount}&from=${originCurrency}&to=${convertedCurrency}`,
            { signal: controller.signal }
          );
          const data = await res.json();
          setRate(data.rates[convertedCurrency]);
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setRate(err.message);
          }
        }
      }
      convertCurrency();
      return function () {
        controller.abort();
      };
    },
    [amount, originCurrency, convertedCurrency]
  );

  return (
    <div>
      <input type="text" value={amount} onChange={(e) => handleInputValue(e)} />
      <CurrencySelect
        currencies={currencies}
        currency={originCurrency}
        onSetCurrency={setOriginCurrency}
      />
      <CurrencySelect
        currencies={currencies}
        currency={convertedCurrency}
        onSetCurrency={setConvertedCurrency}
      />
      <p>{rate}</p>
    </div>
  );
}

function CurrencySelect({ currencies, currency, onSetCurrency }) {
  return (
    <select value={currency} onChange={(e) => onSetCurrency(e.target.value)}>
      {currencies.map((c) => (
        <CurrencyOption key={c} currency={c} />
      ))}
    </select>
  );
}

function CurrencyOption({ currency }) {
  return <option value={currency}>{currency}</option>;
}
