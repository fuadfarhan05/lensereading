import { signOut } from "firebase/auth";
import { auth } from "../components/firebase";
import { useNavigate } from "react-router-dom";

function SignOutButton() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/signin"); // after sign-out, go back to Sign In
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <button onClick={handleSignOut} style={styles.button}>
      Sign Out
    </button>
  );
}

const styles = {
  button: {
    background: "rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(10px)",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  },
};

export default SignOutButton;
