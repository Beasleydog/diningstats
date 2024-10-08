// TimeBlockCalendar.js
import React, { useState, useCallback, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const TimeBlockCalendar = ({ events, setEvents }) => {
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const handleSelect = ({ start, end }) => {
    console.log(start, end);
    const newEvent = {
      id: String(Date.now()),
      start: new Date(start), // Ensure Date object
      end: new Date(end), // Ensure Date object
      title: "New Event",
      // Removed dayOfWeek and time properties for simplicity
    };
    setEvents([...events, newEvent]);
  };

  const handleEventResize = useCallback(
    ({ event, start, end }) => {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === event.id
            ? {
                ...ev,
                start: new Date(start), // Ensure Date object
                end: new Date(end), // Ensure Date object
              }
            : ev
        )
      );
    },
    [setEvents]
  );

  const handleEventDrop = useCallback(
    ({ event, start, end }) => {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === event.id
            ? {
                ...ev,
                start: new Date(start), // Ensure Date object
                end: new Date(end), // Ensure Date object
              }
            : ev
        )
      );
    },
    [setEvents]
  );

  const handleDoubleClickEvent = useCallback((event) => {
    setEditingEvent(event);
    setEditingTitle(event.title);
  }, []);

  const handleEditEventTitle = (newTitle) => {
    setEditingTitle(newTitle);
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === editingEvent.id ? { ...ev, title: newTitle } : ev
      )
    );
  };

  const handleSaveEventTitle = () => {
    setEditingEvent(null);
  };

  const handleDeleteEvent = useCallback(
    (eventId) => {
      setEvents((prev) => prev.filter((ev) => ev.id !== eventId));
      setEditingEvent(null);
    },
    [setEvents]
  );

  const handleCloseEdit = () => {
    setEditingEvent(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Escape") {
      handleSaveEventTitle();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editingEvent && !event.target.closest(".edit-modal")) {
        handleSaveEventTitle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingEvent]);

  const formats = {
    dayFormat: (date, culture, localizer) =>
      localizer.format(date, "dddd", culture),
  };

  // Convert event.start and event.end to Date objects if they aren't already
  const encodedEvents = events.map((event) => {
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );

    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);

    // Adjust the date to the current week while preserving the day of the week
    eventStart.setFullYear(
      startOfWeek.getFullYear(),
      startOfWeek.getMonth(),
      startOfWeek.getDate() + eventStart.getDay()
    );
    eventEnd.setFullYear(
      startOfWeek.getFullYear(),
      startOfWeek.getMonth(),
      startOfWeek.getDate() + eventEnd.getDay()
    );

    // Preserve the original time
    eventStart.setHours(eventStart.getHours(), eventStart.getMinutes());
    eventEnd.setHours(eventEnd.getHours(), eventEnd.getMinutes());

    return {
      ...event,
      start: eventStart,
      end: eventEnd,
    };
  });

  console.log(events, encodedEvents);

  return (
    <div style={{ height: "500px", position: "relative" }}>
      <DnDCalendar
        selectable
        localizer={localizer}
        events={encodedEvents}
        defaultView="week"
        views={["week"]}
        step={15}
        timeslots={4}
        onSelectSlot={handleSelect}
        onEventResize={handleEventResize}
        onEventDrop={handleEventDrop}
        onDoubleClickEvent={handleDoubleClickEvent}
        resizable
        toolbar={false}
        min={new Date(0, 0, 0, 7, 0, 0)}
        max={new Date(0, 0, 0, 21, 0, 0)}
        formats={formats}
        components={{
          event: (props) => (
            <div
              style={{
                height: "100%",
                width: "100%",
                position: "relative",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <span style={{ padding: "4px", display: "block" }}>
                {props.event.title}
              </span>
            </div>
          ),
        }}
      />
      {editingEvent && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
          />
          <div
            className="edit-modal"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              zIndex: 1000,
            }}
          >
            <input
              type="text"
              value={editingTitle}
              onChange={(e) => handleEditEventTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                width: "100%",
                marginBottom: "8px",
                padding: "6px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
              autoFocus
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={() => handleDeleteEvent(editingEvent.id)}
                style={{
                  padding: "6px 12px",
                  background: "#ff4d4d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
              <button
                onClick={handleCloseEdit}
                style={{
                  padding: "6px 12px",
                  background: "#808080",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Ok
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TimeBlockCalendar;
