import React from "react";

const diningHallHours = {
  "Bursley Dining Hall": {
    0: [
      { start: 9, end: 10.5, name: "Breakfast" },
      { start: 10.5, end: 14, name: "Brunch" },
      { start: 16.5, end: 21, name: "Dinner" },
    ],
    1: [
      { start: 7, end: 10.5, name: "Breakfast" },
      { start: 10.5, end: 16.5, name: "Lunch" },
      { start: 16.5, end: 21, name: "Dinner" },
    ],
    5: [
      { start: 7, end: 10.5, name: "Breakfast" },
      { start: 10.5, end: 16.5, name: "Lunch" },
      { start: 16.5, end: 20, name: "Dinner" },
    ],
    6: [
      { start: 9, end: 10.5, name: "Breakfast" },
      { start: 10.5, end: 14, name: "Brunch" },
      { start: 16.5, end: 20, name: "Dinner" },
    ],
  },
  "East Quad Dining Hall": {
    0: [
      { start: 9, end: 10.5, name: "Breakfast" },
      { start: 10.5, end: 14, name: "Brunch" },
      { start: 16.5, end: 20, name: "Dinner" },
    ],
    1: [
      { start: 7, end: 10.5, name: "Breakfast" },
      { start: 10.5, end: 15, name: "Lunch" },
      { start: 16.5, end: 20, name: "Dinner" },
    ],
    6: [
      { start: 9, end: 10.5, name: "Breakfast" },
      { start: 10.5, end: 14, name: "Brunch" },
      { start: 16.5, end: 20, name: "Dinner" },
    ],
  },
  "Markley Dining Hall": {
    0: [{ start: 10.5, end: 14, name: "Brunch" }],
    1: [
      { start: 7, end: 10.5, name: "Breakfast" },
      { start: 10.5, end: 15, name: "Lunch" },
      { start: 16.5, end: 20, name: "Dinner" },
    ],
    6: [{ start: 10.5, end: 14, name: "Brunch" }],
  },
  "Mosher Jordan Dining Hall": {
    0: [
      { start: 9, end: 10.5, name: "Breakfast" },
      { start: 10.5, end: 14, name: "Brunch" },
      { start: 16.5, end: 21, name: "Dinner" },
    ],
    1: [
      { start: 7, end: 10.5, name: "Breakfast" },
      { start: 10.5, end: 16.5, name: "Lunch" },
      { start: 16.5, end: 21, name: "Dinner" },
    ],
    5: [
      { start: 7, end: 10.5, name: "Breakfast" },
      { start: 10.5, end: 16.5, name: "Lunch" },
      { start: 16.5, end: 20, name: "Dinner" },
    ],
    6: [
      { start: 9, end: 10.5, name: "Breakfast" },
      { start: 10.5, end: 14, name: "Brunch" },
      { start: 16.5, end: 20, name: "Dinner" },
    ],
  },
  "North Quad Dining Hall": {
    0: [{ start: 10.5, end: 14, name: "Brunch" }],
    1: [
      { start: 7, end: 10.5, name: "Breakfast" },
      { start: 10.5, end: 15, name: "Lunch" },
      { start: 16.5, end: 20, name: "Dinner" },
    ],
    6: [{ start: 10.5, end: 14, name: "Brunch" }],
  },
  "South Quad Dining Hall": {
    0: [
      { start: 9, end: 10.5, name: "Breakfast" },
      { start: 10.5, end: 14, name: "Brunch" },
      { start: 16.5, end: 21, name: "Dinner" },
    ],
    1: [
      { start: 7, end: 10.5, name: "Breakfast" },
      { start: 10.5, end: 16.5, name: "Lunch" },
      { start: 16.5, end: 21, name: "Dinner" },
    ],
    5: [
      { start: 7, end: 10.5, name: "Breakfast" },
      { start: 10.5, end: 16.5, name: "Lunch" },
      { start: 16.5, end: 20, name: "Dinner" },
    ],
    6: [
      { start: 9, end: 10.5, name: "Breakfast" },
      { start: 10.5, end: 14, name: "Brunch" },
      { start: 16.5, end: 20, name: "Dinner" },
    ],
  },
  "Twigs At Oxford": {
    0: [
      { start: 10.5, end: 14, name: "Brunch" },
      { start: 16.5, end: 20, name: "Dinner" },
    ],
    1: [
      { start: 7, end: 10.5, name: "Breakfast" },
      { start: 10.5, end: 14, name: "Lunch" },
      { start: 16.5, end: 20, name: "Dinner" },
    ],
    6: [
      { start: 10.5, end: 14, name: "Brunch" },
      { start: 16.5, end: 20, name: "Dinner" },
    ],
  },
};

const getHallHours = (hall, day) => {
  const hours = diningHallHours[hall];
  return hours[day] || hours[1]; // Default to Monday-Friday schedule if specific day not found
};

const BestTime = ({ dataForSelectedDay, selectedHalls, selectedDay }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "20px",
      }}
    >
      {Object.keys(selectedHalls)
        .filter((hall) => selectedHalls[hall])
        .map((hall) => (
          <DiningHallSection
            key={hall}
            hall={hall}
            selectedDay={selectedDay}
            dataForSelectedDay={dataForSelectedDay}
          />
        ))}
    </div>
  );
};

const DiningHallSection = ({ hall, selectedDay, dataForSelectedDay }) => {
  return (
    <div style={{ flex: "1 1 300px", maxWidth: "400px" }}>
      <h3>{hall}</h3>
      {getHallHours(hall, selectedDay).map((section) => (
        <MealSection
          key={section.name}
          section={section}
          hall={hall}
          dataForSelectedDay={dataForSelectedDay}
        />
      ))}
    </div>
  );
};

const MealSection = ({ section, hall, dataForSelectedDay }) => {
  const sectionData = dataForSelectedDay.filter((entry) => {
    const entryHour =
      entry.Timestamp.getHours() + entry.Timestamp.getMinutes() / 60;
    return entryHour >= section.start && entryHour < section.end;
  });

  if (sectionData.length === 0) return null;

  const lowestCapacityEntry = sectionData.reduce((min, entry) =>
    entry[hall] < min[hall] ? entry : min
  );

  return (
    <p>
      {section.name}:{" "}
      {lowestCapacityEntry.Timestamp.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}{" "}
      ({lowestCapacityEntry[hall]}% capacity)
    </p>
  );
};

export default BestTime;
