import React, { useEffect, useState, useMemo } from "react";
import DayOfTheWeek from "./graphs/DayOfTheWeek";
import BestTime from "./graphs/bestTime";
import useLocalStorageState from "./helpers/localStorageState";
import "./App.css";
import TimeBlockCalendar from "./components/blockedEvents";
import PrefTimes from "./components/prefTimes";
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

const getDataForSelectedDay = (data, selectedDay, selectedHalls) => {
  //First filter data for selected day
  data = data.filter((record) => record.Timestamp.getDay() === selectedDay);
  //Then filter for selected halls
  data.filter((record) => Object.keys(selectedHalls).includes(record.Hall));
  //Find earliest and latest minutes
  const earliest = Math.min(
    ...data.map(
      (record) =>
        record.Timestamp.getHours() * 60 + record.Timestamp.getMinutes()
    )
  );
  const latest = Math.max(
    ...data.map(
      (record) =>
        record.Timestamp.getHours() * 60 + record.Timestamp.getMinutes()
    )
  );

  const bucketSize = 15;
  const buckets = [];

  for (let i = earliest; i <= latest; i += bucketSize) {
    const bucket = data
      .filter((record) => {
        const recordMinutes =
          record.Timestamp.getHours() * 60 + record.Timestamp.getMinutes();
        return recordMinutes >= i && recordMinutes < i + bucketSize;
      })
      .sort((a, b) => a.Timestamp - b.Timestamp);
    const averages = {};
    Object.keys(selectedHalls).forEach((hall) => {
      if (selectedHalls[hall]) {
        const hallValues = bucket
          .map((record) => record[hall])
          .filter((value) => value !== undefined);
        averages[hall] =
          hallValues.length > 0
            ? hallValues.reduce((sum, value) => sum + value, 0) /
              hallValues.length
            : 0;
      }
    });
    const date = new Date();
    date.setHours(Math.floor(i / 60), i % 60, 0, 0);
    buckets.push({ Timestamp: date, ...averages });
  }
  return buckets;
};

function App() {
  const [data, setData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [blockedEvents, setBlockedEvents] = useLocalStorageState(
    "blockedEvents",
    []
  );
  const [prefTimes, setPrefTimes] = useLocalStorageState("prefTimes", {
    breakfast: { start: "8:00 am", end: "10:30 am" },
    lunch: { start: "11:00 am", end: "2:00 pm" },
    dinner: { start: "5:00 pm", end: "8:00 pm" },
  });
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
  const [showCustomizationOptions, setShowCustomizationOptions] =
    useState(false);

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

  const dataForSelectedDay = useMemo(() => {
    return getDataForSelectedDay(data, selectedDay, selectedHalls);
  }, [data, selectedDay, selectedHalls]);

  const toggleHall = (hall) => {
    setSelectedHalls((prev) => ({ ...prev, [hall]: !prev[hall] }));
  };

  const handleDayChange = (e) => {
    setSelectedDay(Number(e.target.value));
  };

  const toggleCustomizationOptions = () => {
    setShowCustomizationOptions((prev) => !prev);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dining Hall Traffic</h1>
      </header>
      <div className="graphs">
        <BestTime
          selectedHalls={selectedHalls}
          dataForSelectedDay={dataForSelectedDay}
          selectedDay={selectedDay}
          blockedEvents={blockedEvents}
          prefTimes={prefTimes}
        />
        <DayOfTheWeek
          selectedHalls={selectedHalls}
          dataForTodaysDayOfWeek={dataForSelectedDay}
          COLORS={COLORS}
          selectedDay={selectedDay}
        />
      </div>

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
      <br />
      <button
        className="toggle-customization-btn"
        onClick={toggleCustomizationOptions}
      >
        {showCustomizationOptions ? "Hide Customization" : "Show Customization"}
      </button>

      {showCustomizationOptions && (
        <div className="customization-section">
          <TimeBlockCalendar
            events={blockedEvents}
            setEvents={setBlockedEvents}
          />
          <PrefTimes prefTimes={prefTimes} setPrefTimes={setPrefTimes} />
        </div>
      )}
    </div>
  );
}

export default App;
