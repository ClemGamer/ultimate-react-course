// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import { useUrlPosition } from "../hooks/useUrlPosition";

import styles from "./Form.module.css";
import "react-datepicker/dist/react-datepicker.css";

import Button from "./Button";
import ButtonBack from "./ButtonBack";
import Spinner from "./Spinner";
import Message from "./Message";
import DatePicker from "react-datepicker";
import { useCities } from "../hooks/useCities";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const navigate = useNavigate();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [lat, lng] = useUrlPosition();
  const [isGeocodeLoading, setIsGeocodeLoading] = useState(false);
  const [geocodeError, setGeocodeError] = useState("");
  const { createCity, isLoading } = useCities();

  useEffect(
    function () {
      if (!lat && !lng) return;
      const controller = new AbortController();
      async function fetchGeocode() {
        try {
          setIsGeocodeLoading(true);
          setGeocodeError("");
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`,
            { signal: controller.signal }
          );
          const data = await res.json();

          if (!data.countryCode)
            throw new Error("That doesn't seem to be a city.");

          setCityName(
            data.principalSubdivision || data.city || data.locality || ""
          );
          setCountry(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
        } catch (err) {
          if (err.name !== "AbortError") {
            setGeocodeError(err.message);
          }
        } finally {
          setIsGeocodeLoading(false);
        }
      }
      fetchGeocode();
      return () => controller.abort();
    },
    [lat, lng]
  );

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat,
        lng,
      },
    };
    await createCity(newCity);
    navigate("/app/cities");
  }

  if (isGeocodeLoading) return <Spinner />;

  if (!lat && !lng) return <Message message="Click somewhere on the map." />;

  if (geocodeError) return <Message message={geocodeError} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker onChange={(date) => setDate(date)} selected={date} />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;
