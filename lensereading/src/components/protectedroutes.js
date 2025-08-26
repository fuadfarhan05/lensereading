import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <p>Loading...</p>; // show spinner/loader while checking
  }

  if (!user) {
    return <Navigate to="/" replace />; // redirect to SignIn if not logged in
  }

  return children; // if logged in, show the page
}

export default ProtectedRoute;