import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useTokens } from "../Utils/client";
import { CustomAlert } from "../Components/Index";

const ProtectedRouteTest = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "warning",
  });
  const [countdown, setCountdown] = useState(3);
  const [redirect, setRedirect] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const { token } = useTokens();

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
    return <Navigate to="/login" replace />;
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

export default ProtectedRouteTest;
