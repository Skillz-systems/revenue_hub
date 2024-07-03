import React from "react";
import ReactDOM from "react-dom";

const PasswordAccountPortal = ({ children }: { children: React.ReactNode }) => {
  const portalRoot = document.getElementById("password-account-portal");

  if (!portalRoot) return null;

  return ReactDOM.createPortal(children, portalRoot);
};

export default PasswordAccountPortal;
