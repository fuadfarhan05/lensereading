import React from "react";
import ClassForm from "../components/classform";
import ScheduleGrid from "../components/schedule";
import SignOutButton from "./signout";
import "../App.css";

function Student() {
  return (
    <div className="student-dashboard">
        <SignOutButton />
      <div className="dashboard-layout">
        <ClassForm />
        <ScheduleGrid />
      </div>
    </div>
  );
}

export default Student;
