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
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { plan }); // ONLY set plan
      navigate("/main");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pricing-page">
      <h1 className="pricing-title">Choose Your Plan</h1>
      <div className="plans">
        <div className="plan-card free-plan">
          <h2>Free</h2>
          <p className="price">$0<span>/month</span></p>
          <ul>
            <li>Basic PDF Upload</li>
            <li>AI Highlight (limited)</li>
            <li>Community Support</li>
          </ul>
          <button className="plan-btn" onClick={() => choosePlan("free")}>Select</button>
        </div>

        <div className="plan-card pro-plan">
          <h2>Pro</h2>
          <p className="price">$5<span>/month</span></p>
          <ul>
            <li>Unlimited PDF Uploads</li>
            <li>Unlimited AI Highlights</li>
            <li>Priority Support</li>
          </ul>
          <button className="plan-btn pro-btn" onClick={() => choosePlan("pro")}>Upgrade</button>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
