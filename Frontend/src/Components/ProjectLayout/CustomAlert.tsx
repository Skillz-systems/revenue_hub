import React from "react";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

const CustomAlert = ({ isOpen, message, severity, handleClose }) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={isOpen}
      autoHideDuration={6000}
      onClose={handleClose}
      message={message}
    >
      <Alert onClose={handleClose} variant={"filled"} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomAlert;
