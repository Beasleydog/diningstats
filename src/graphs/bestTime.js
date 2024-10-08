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

const BestTime = ({
  dataForSelectedDay,
  selectedHalls,
  selectedDay,
  blockedEvents,
  prefTimes,
}) => {
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
            blockedEvents={blockedEvents}
            prefTimes={prefTimes}
          />
        ))}
    </div>
  );
};

const DiningHallSection = ({
  hall,
  selectedDay,
  dataForSelectedDay,
  blockedEvents,
  prefTimes,
}) => {
  return (
    <div style={{ flex: "1 1 300px", maxWidth: "400px" }}>
      <h3>{hall}</h3>
      {getHallHours(hall, selectedDay).map((section) => (
        <MealSection
          key={section.name}
          section={section}
          hall={hall}
          dataForSelectedDay={dataForSelectedDay}
          blockedEvents={blockedEvents}
          prefTimes={prefTimes}
        />
      ))}
    </div>
  );
};

const MealSection = ({
  section,
  hall,
  dataForSelectedDay,
  blockedEvents,
  prefTimes,
}) => {
  const sectionData = dataForSelectedDay.filter((entry) => {
    const entryHour =
      entry.Timestamp.getHours() + entry.Timestamp.getMinutes() / 60;
    return entryHour >= section.start && entryHour < section.end;
  });

  if (sectionData.length === 0) return null;

  const availableEntries = sectionData.filter((entry) => {
    const entryTime = entry.Timestamp.getTime();
    return !blockedEvents.some(
      (event) => entryTime >= event.start && entryTime < event.end
    );
  });

  if (availableEntries.length === 0) return null;
  const [hours, minutes, period] = prefTimes[section.name.toLowerCase()].start
    .match(/(\d+):(\d+) (\w+)/)
    .slice(1);
  const prefStartTime = new Date();
  prefStartTime.setHours(
    period.toLowerCase() === "pm" && hours !== "12"
      ? parseInt(hours) + 12
      : parseInt(hours),
    parseInt(minutes),
    0,
    0
  );
  const prefStartHours =
    prefStartTime.getHours() + prefStartTime.getMinutes() / 60;

  const eligibleEntries = availableEntries.filter((entry) => {
    const entryHour =
      entry.Timestamp.getHours() + entry.Timestamp.getMinutes() / 60;
    return entryHour >= prefStartHours;
  });

  if (eligibleEntries.length === 0) return null;

  // Sort eligible entries by capacity (ascending) and time (descending)
  const sortedEntries = eligibleEntries.sort((a, b) => {
    if (a[hall] !== b[hall]) {
      return a[hall] - b[hall]; // Sort by capacity (ascending)
    }
    return b.Timestamp - a.Timestamp; // If capacity is the same, prefer later times
  });

  const bestEntry = sortedEntries[0];

  return (
    <p>
      {section.name}:{" "}
      {bestEntry.Timestamp.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}{" "}
      ({bestEntry[hall]}% capacity)
    </p>
  );
};

export default BestTime;
