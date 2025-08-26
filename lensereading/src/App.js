import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./components/firebase";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import Main from "./pages/main";  
import Pricing from "./pages/payment";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={user ? <Navigate to="/main" /> : <Navigate to="/signin" />} />

        {/* Sign-in and Sign-up */}
        <Route path="/signin" element={!user ? <SignIn /> : <Navigate to="/main" />} />
        <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/main" />} />

        {/* Pricing is only accessed manually via Upgrade button */}
        <Route path="/pricing" element={user ? <Pricing /> : <Navigate to="/signin" />} />

        {/* Main app */}
        <Route path="/main" element={user ? <Main /> : <Navigate to="/signin" />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
