import React, { useState } from "react";
import { auth, db } from "../components/firebase";
import { collection, addDoc } from "firebase/firestore";

const CLASS_COLORS = [
  { value: "blue", label: "Ocean Blue" },
  { value: "purple", label: "Royal Purple" },
  { value: "pink", label: "Soft Pink" },
  { value: "orange", label: "Warm Orange" },
  { value: "yellow", label: "Sunny Yellow" },
  { value: "red", label: "Coral Red" },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function ClassForm() {
  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    days: [], // multi-day
    color: "blue",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.startTime || !formData.endTime || formData.days.length === 0) {
      alert("Please fill in all fields and select at least one day");
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    try {
      // Create a class for each selected day
      for (const day of formData.days) {
        await addDoc(collection(db, "users", user.uid, "schedule"), {
          name: formData.name,
          startTime: formData.startTime,
          endTime: formData.endTime,
          day,
          color: formData.color,
        });
      }

      setFormData({ name: "", startTime: "", endTime: "", days: [], color: "blue" });
    } catch (err) {
      console.error("Error adding class:", err);
    }
  };

  const toggleDay = (day) => {
    setFormData((prev) => {
      if (prev.days.includes(day)) {
        return { ...prev, days: prev.days.filter((d) => d !== day) };
      } else {
        return { ...prev, days: [...prev.days, day] };
      }
    });
  };

  return (
    <div className="class-form-card">
      <h2>Add New Class</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Class Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Mathematics, History..."
          />
        </div>

        <div className="form-group">
          <label>Select Days</label>
          <div className="color-options">
            {DAYS.map((day) => (
              <button
                key={day}
                type="button"
                className={`color-circle ${formData.days.includes(day) ? "selected" : ""}`}
                style={{ backgroundColor: formData.days.includes(day) ? "rgba(136, 244, 136, 1)" : "#ccc" }}
                onClick={() => toggleDay(day)}
              >
                {day[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Start Time</label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
          />
        </div>

        <div className="form-group">
          <label>End Time</label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
          />
        </div>

        <div className="form-group">
          <label>Color</label>
          <div className="color-options">
            {CLASS_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                className={`color-circle ${formData.color === color.value ? "selected" : ""}`}
                style={{ backgroundColor: `var(--${color.value})` }}
                onClick={() => setFormData((prev) => ({ ...prev, color: color.value }))}
                title={color.label}
              />
            ))}
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Add Class
        </button>
      </form>
    </div>
  );
}

export default ClassForm;
