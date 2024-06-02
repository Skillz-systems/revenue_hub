import React, { useEffect, useContext, useState } from "react";
import { ErrorContext } from "./ErrorContext";
import ErrorPage from "../Pages/ErrorPage";

const ErrorBoundary = ({ children }) => {
  const { hasError, setHasError } = useContext(ErrorContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (error) {
      setHasError(true);
    }
  }, [error, setHasError]);

  const componentDidCatch = (error) => {
    setError(error);
  };

  if (hasError) {
    return <ErrorPage errorInformation={hasError} />;
  }

  return (
    <ErrorBoundaryWrapper componentDidCatch={componentDidCatch}>
      {children}
    </ErrorBoundaryWrapper>
  );
};

// Helper component to catch errors in functional ErrorBoundary
const ErrorBoundaryWrapper = ({ children, componentDidCatch }) => {
  useEffect(() => {
    const handleError = (error) => {
      componentDidCatch(error);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleError);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleError);
    };
  }, [componentDidCatch]);

  return children;
};

export default ErrorBoundary;
