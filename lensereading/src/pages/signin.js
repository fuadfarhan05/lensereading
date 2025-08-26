import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../components/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "../App.css";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/main"); 
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="signin-container">
      <img className="signinimg" alt="" src="lensereview.png"></img>
      <h2>Welcome to Lense</h2>
      <h3>Sign In</h3>
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
        <button onClick={login}>Login</button>
      </div>
      <p className="dont">
        Don’t have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default SignIn;