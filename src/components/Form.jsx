// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import Button from "./Button";
import styles from "./Form.module.css";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import Message from "./Message";
import { useUrlPosition } from "../hooks/useUrlPosition";
import { useCities } from "../contexts/CitiesContext";
import DatePicker from "react-datepicker"; //TARİH SEÇİCİ npm install react-datepicker --save yazdım terminale react datepicker yazarsan googla yönlendirmeler mevcut.
import "react-datepicker/dist/react-datepicker.css"; // bu css'de eklenmeli

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client?";
function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [emoji, setEmoji] = useState("");
  const [date, setDate] = useState(new Date().toDateString());
  const [notes, setNotes] = useState("");
  const [isLoadingGeoCoding, setIsLoadingGeoCoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState("");
  const navigate = useNavigate(); //navigate custom hook mükemmel bir şey. react-router tarafından bize sağlanan bir hook. bu hook bir fonksiyon döndürür navigate diye aldık bu fonksiyonu ve aşağıda dive tıkladığında kullanıcı bir event handler ile bu fonksiyonu çağırıcaz ve bu fonksiyona girdiğimiz değer url'ye gönderilecek.
  const { createCity, isLoading } = useCities();

  const { lat, lng } = useUrlPosition();
  useEffect(
    function () {
      if (!lat && !lng) return;
      async function getInformation() {
        try {
          setGeocodingError("");
          setIsLoadingGeoCoding(true);
          const res = await fetch(
            `${BASE_URL}latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();

          if (!data.city)
            throw new Error(
              "That doesn't seem to be city. Click somewhere else 😉"
            );
          setCityName(data.city);
          setCountry(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
          setIsLoadingGeoCoding(false);
        } catch (err) {
          setGeocodingError(err.message);
        } finally {
          setIsLoadingGeoCoding(false);
        }
      }
      getInformation();
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
      position: { lat, lng },
    };
    await createCity(newCity);

    navigate("/app/cities");
  }

  if (isLoadingGeoCoding) return <Spinner />;
  if (!lat && !lng)
    return <Message message="Start by clicking somewhere on the map" />;
  if (geocodingError) return <Message message={geocodingError} />;
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
        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="dd/MM/yyyy"
        />{" "}
        {/* propsları vs react datepicker sitesinden aldım. */}
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
        <Button
          onClick={(e) => {
            //bunda e.preventDefault() kullandığım için add olan buton sadece submit edecek.
            e.preventDefault();
            navigate(-1);
          }}
          type="back"
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
