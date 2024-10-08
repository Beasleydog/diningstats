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
    const newEvent = {
      id: String(Date.now()),
      start: start.getHours() * 60 + start.getMinutes(),
      end: end.getHours() * 60 + end.getMinutes(),
      title: "New Event",
      dayOfWeek: start.getDay(),
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
                start: start.getHours() * 60 + start.getMinutes(),
                end: end.getHours() * 60 + end.getMinutes(),
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
                start: start.getHours() * 60 + start.getMinutes(),
                end: end.getHours() * 60 + end.getMinutes(),
                dayOfWeek: start.getDay(),
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

  const encodedEvents = events.map((event) => {
    const today = new Date();
    const startOfWeek = today.getDate() - today.getDay();

    const storedStartDate = new Date(event.start);
    const startDay = storedStartDate.getDay();
    const startHours = storedStartDate.getHours();
    const startMinutes = storedStartDate.getMinutes();
    const newStartDate = new Date();
    newStartDate.setDate(
      startOfWeek + ((startDay - newStartDate.getDay() + 7) % 7)
    );
    newStartDate.setHours(startHours, startMinutes, 0, 0);

    const storedEndDate = new Date(event.end);
    const endDay = storedEndDate.getDay();
    const endHours = storedEndDate.getHours();
    const endMinutes = storedEndDate.getMinutes();
    const newEndDate = new Date();
    newEndDate.setDate(startOfWeek + ((endDay - newEndDate.getDay() + 7) % 7));
    newEndDate.setHours(endHours, endMinutes, 0, 0);

    return {
      ...event,
      start: newStartDate,
      end: newEndDate,
    };
  });

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
