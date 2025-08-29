import React, { useState } from "react";
import {
  HiClipboardCheck,
  HiBookOpen,
} from "react-icons/hi";
import { PiXCircleBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import "../App.css";

const menuItems = [
  { icon: HiClipboardCheck, label: "Highlight", route: "/main" },
  { icon: PiXCircleBold, label: "The Student", route: "/dashboard" },
  { icon: HiBookOpen, label: "Social", route: "https://lenseforlearning.vercel.app/" },

];

function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setOpen((prev) => !prev)}
        style={{
          position: "fixed",
          top: 20,
          left: open ? 220 : 20,
          zIndex: 1001,
          transition: "left 0.3s",
          borderRadius: 8,
          padding: "8px 12px",
          background: open ? "rgba(231, 225, 225, 0.3)" : "rgba(161, 242, 188, 0.3)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          borderRadius: "16px",
          color: open ? "#ec3e38ff": "#8bfcb6",
          border: "none",
          cursor: "pointer",
          marginTop: 80,
        }}
      >
        {open ? <PiXCircleBold/> : "Options"}
      </button>
      <div
        className="sidebar"
        style={{
          width: open ? 200 : 0,
          overflow: "hidden",
          transition: "width 0.3s",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          background: "#363d3aff",
          zIndex: 1000,
        }}
      >
        <ul className="sidebar-items" style={{ padding: open ? "20px 0" : 0 }}>
          {open &&
            menuItems.map((item, index) => (
              <li
                key={index}
                className="sidebar-item"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  if (item.route.startsWith("http")) {
                    window.open(item.route, "_blank", "noopener,noreferrer"); // 🔹 opens external links in new tab
                  } else {
                    navigate(item.route); // 🔹 internal routes still use react-router
                  }
                }}
              >
                <item.icon className="sidebar-icon" />
                <span className="sidebar-label">{item.label}</span>
                {item.badge && <span className="sidebar-badge">{item.badge}</span>}
              </li>

            ))}
        </ul>
      </div>
    </>
  );
}

export default Sidebar;