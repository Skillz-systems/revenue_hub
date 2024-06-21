import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useTokens } from "../Utils/client";
import { CustomAlert } from "../Components/Index";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "warning",
  });
  const [countdown, setCountdown] = useState<number>(3);
  const [redirect, setRedirect] = useState<boolean>(false);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const { token } = useTokens();
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      setSnackbar({
        open: true,
        message: `You are not Logged In. Redirecting to login page in ${countdown} seconds...`,
        severity: "warning",
      });

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            setRedirect(true);
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [token, countdown]);

  if (redirect) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      {children}
      <CustomAlert
        isOpen={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        handleClose={handleSnackbarClose}
      />
    </>
  );
};

export default ProtectedRoute;
