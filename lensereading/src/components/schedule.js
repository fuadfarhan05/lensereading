import React, { useEffect, useState } from "react";
import { auth, db } from "../components/firebase";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import "../App.css";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function ScheduleGrid() {
  const [classes, setClasses] = useState([]);
  const [currentTimePosition, setCurrentTimePosition] = useState(0);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsubscribe = onSnapshot(collection(db, "users", user.uid, "schedule"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setClasses(data.sort((a, b) => a.startTime.localeCompare(b.startTime)));
    });

    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      setCurrentTimePosition((hours - 8) * 60 + minutes); // adjust 8 AM start
    }, 60000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const removeClass = async (id) => {
    const user = auth.currentUser;
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "schedule", id));
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${minute} ${ampm}`;
  };

  return (
    <div className="schedule-grid">
      {DAYS.map((day) => (
        <div key={day} className="day-column">
          <h3 className="day-title">{day}</h3>
          <div className="day-classes">
            {classes
              .filter((c) => c.day === day)
              .map((c) => (
                <div
                  key={c.id}
                  className="class-block"
                  style={{ backgroundColor: `var(--${c.color})`, position: "relative" }}
                >
                  <span className="class-name">{c.name}</span>
                  <span className="class-time">
                    {formatTime(c.startTime)} - {formatTime(c.endTime)}
                  </span>
                  <button
                    className="remove-btn"
                    onClick={() => removeClass(c.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            {/* Current Time Line */}
            {day === DAYS[new Date().getDay() - 1] && (
              <div
                className="current-time-line"
                style={{ top: `${currentTimePosition}px` }}
              ></div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ScheduleGrid;
