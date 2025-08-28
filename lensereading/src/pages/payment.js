import React from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../components/firebase";
import { doc, updateDoc } from "firebase/firestore";

function Pricing() {
  const navigate = useNavigate();

  const choosePlan = async (plan) => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/signin");
      return;
    }

    if (plan === "pro") {
      try {
        const res = await fetch("http://localhost:8000/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid }),
        });

        const data = await res.json();

        if (data.url) {
          window.location.href = data.url;
        } else {
          console.error("Stripe session error:", data);
        }
      } catch (err) {
        console.error("Checkout error:", err);
      }
    } else {
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { plan: "free" });
        navigate("/main");
      } catch (err) {
        console.error(err);
      }
    }
  };

  // ✅ SVG check component
  const Check = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="green"
      viewBox="0 0 16 16"
      style={{ marginRight: "8px" }}
    >
      <path d="M13.485 1.929a1 1 0 0 1 0 1.414l-7.071 7.071-3.536-3.536a1 1 0 0 1 1.414-1.414L6.414 8.586l6.657-6.657a1 1 0 0 1 1.414 0z"/>
    </svg>
  );

  return (
    <div className="pricing-page">
      <h1 className="pricing-title">Choose Your Plan</h1>
      <div className="plans">
        {/* Free Plan */}
        <div className="plan-card free-plan">
          <h2>Free</h2>
          <p className="price">
            $0<span>/month</span>
          </p>
          <ul>
            <li><Check />Upload PDF and Paste Texts</li>
            <li><Check />AI Features (limited to 5 credits per day)</li>
            <li><Check />Whiteboard without collaboration</li>
          </ul>
          <button className="plan-btn" onClick={() => choosePlan("free")}>
            Select
          </button>
        </div>

        {/* Pro Plan */}
        <div className="plan-card pro-plan">
          <h2>Pro</h2>
          <p className="price">
            $5<span>/month</span>
          </p>
          <ul>
            <li><Check />Upload PDF and Past Text</li>
            <li><Check />All features access</li>
            <li><Check />Unlimited AI Features</li>
            <li><Check />Shared Whiteboard Collaboration</li>
          </ul>
          <button className="plan-btn pro-btn" onClick={() => choosePlan("pro")}>
            Upgrade
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
