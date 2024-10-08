import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function PrefTimes({ prefTimes, setPrefTimes }) {
  const handleTimeChange = (meal, date) => {
    setPrefTimes((prev) => ({
      ...prev,
      [meal]: {
        ...prev[meal],
        start: date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      },
    }));
  };

  const parseTime = (timeString) => {
    if (typeof timeString === "string") {
      const [time, period] = timeString.split(" ");
      if (time && period) {
        const [hours, minutes] = time.split(":");
        const date = new Date();
        date.setHours(
          period.toLowerCase() === "pm" && hours !== "12"
            ? parseInt(hours, 10) + 12
            : parseInt(hours, 10)
        );
        date.setMinutes(parseInt(minutes, 10));
        return date;
      }
    }
    return new Date(); // Return current date if timeString is not valid
  };

  const containerStyle = {
    margin: "0 auto",
    padding: "20px",
    borderRadius: "8px",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  };

  const mealSectionStyle = {
    marginBottom: "20px",
    padding: "15px",
    backgroundColor: "#f5f5f5",
    borderRadius: "6px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  };

  const headingStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
  };

  const timePickerContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
  };

  const labelStyle = {
    fontSize: "14px",
    color: "#666",
    marginRight: "10px",
  };

  const datePickerStyle = {
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
  };

  return (
    <div style={containerStyle}>
      {["breakfast", "lunch", "dinner"].map((meal) => (
        <div key={meal} style={mealSectionStyle}>
          <h3 style={headingStyle}>
            {meal.charAt(0).toUpperCase() + meal.slice(1)}
          </h3>
          <div style={timePickerContainerStyle}>
            <label style={labelStyle}>Eat after:</label>
            <DatePicker
              selected={parseTime(prefTimes[meal].start)}
              onChange={(date) => handleTimeChange(meal, date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              timeFormat="h:mm aa"
              style={datePickerStyle}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
