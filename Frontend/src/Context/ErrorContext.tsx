import React, { createContext, useState, useContext } from "react";

export const ErrorContext = createContext<any>(undefined);

export const ErrorProvider = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <ErrorContext.Provider value={{ hasError, setHasError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => useContext(ErrorContext);
