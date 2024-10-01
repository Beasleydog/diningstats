import React, { useEffect, useState } from "react";
import DayOfTheWeek from "./graphs/DayOfTheWeek";
import BestTime from "./graphs/bestTime";
import useLocalStorageState from "./helpers/localStorageState";
import "./App.css";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4560",
  "#775DD0",
  "#3F51B5",
];

function App() {
  const [data, setData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [selectedHalls, setSelectedHalls] = useLocalStorageState(
    "selectedHalls",
    {
      "Bursley Dining Hall": true,
      "East Quad Dining Hall": true,
      "Markley Dining Hall": true,
      "South Quad Dining Hall": true,
      "North Quad Dining Hall": true,
      "Mosher Jordan Dining Hall": true,
      "Twigs At Oxford": true,
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbxvUzyCOAdhmVpfKIq5-1fqnmUILnRX1xCV3Tgvwl1I-LnKq8SRyh7QCou3L_dI6QYBAw/exec"
        );
        const fetchedData = await response.json();
        const headers = fetchedData[0];
        const records = fetchedData.slice(1).map((record) => {
          const obj = headers.reduce((acc, header, index) => {
            const value = record[index];
            acc[header] =
              value === "" ? 0 : isNaN(Number(value)) ? value : Number(value);
            return acc;
          }, {});
          obj.Timestamp = new Date(obj.Timestamp);
          return obj;
        });
        setData(records);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const dataForSelectedDay = data.filter(
    (record) => record.Timestamp.getDay() === selectedDay
  );

  const toggleHall = (hall) => {
    setSelectedHalls((prev) => ({ ...prev, [hall]: !prev[hall] }));
  };

  const handleDayChange = (e) => {
    setSelectedDay(Number(e.target.value));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dining Hall Traffic</h1>
      </header>
      <div className="controls">
        <div className="day-selector">
          <label htmlFor="day-select">Select Day: </label>
          <select
            id="day-select"
            value={selectedDay}
            onChange={handleDayChange}
          >
            <option value={0}>Sunday</option>
            <option value={1}>Monday</option>
            <option value={2}>Tuesday</option>
            <option value={3}>Wednesday</option>
            <option value={4}>Thursday</option>
            <option value={5}>Friday</option>
            <option value={6}>Saturday</option>
          </select>
        </div>
        <div className="hall-checkboxes">
          <h3>Select Dining Halls:</h3>
          {Object.keys(selectedHalls).map((hall) => (
            <label key={hall} className="hall-checkbox">
              <input
                type="checkbox"
                checked={selectedHalls[hall]}
                onChange={() => toggleHall(hall)}
              />
              {hall}
            </label>
          ))}
        </div>
      </div>
      <div className="graphs">
        <BestTime
          selectedHalls={selectedHalls}
          dataForSelectedDay={dataForSelectedDay}
          selectedDay={selectedDay}
        />
        <DayOfTheWeek
          selectedHalls={selectedHalls}
          dataForTodaysDayOfWeek={dataForSelectedDay}
          COLORS={COLORS}
          selectedDay={selectedDay}
        />
      </div>
    </div>
  );
}

export default App;
