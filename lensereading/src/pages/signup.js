import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../components/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import "../App.css";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create Firestore document for new user
      await setDoc(doc(db, "users", user.uid), {
        plan: "free",
        credits: 5, // 5 daily credits
        lastReset: Timestamp.fromDate(new Date())
      });

      navigate("/main");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="signin-container">
      <img className="signinimg" alt="" src="lensereview.png"></img>
      <h2>Create Your Account</h2>
      <h3>Sign Up</h3>
      <input 
        type="email" 
        placeholder="Email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div>
        <button onClick={signup}>Sign Up</button>
      </div>
      <p className="dont">
        Already have an account? <Link to="/">Sign In</Link>
      </p>
    </div>
  );
}

export default SignUp;
