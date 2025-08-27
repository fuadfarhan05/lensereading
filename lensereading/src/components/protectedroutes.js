import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <p>Loading...</p>; 
  }

  if (!user) {
    return <Navigate to="/" replace />; 
  }

  return children; 
}

export default ProtectedRoute;