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
    return <ErrorPage errorInformation={error} />;
  }

  return (
    <ErrorBoundaryWrapper componentDidCatch={componentDidCatch}>
      {children}
    </ErrorBoundaryWrapper>
  );
};

const ErrorBoundaryWrapper = ({ children, componentDidCatch }) => {
  useEffect(() => {
    const handleError = (event) => {
      componentDidCatch(event.error || new Error(event.reason));
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
