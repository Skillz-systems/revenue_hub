import React, { useState } from "react";
import { CustomAlert } from "../Index";
import { useTokens } from "../../Utils/client";

interface DemandPropertyButtonsProps {
  iconOne: React.ReactNode;
  iconTwo: React.ReactNode;
  buttonTextOne: string;
  buttonTextTwo: string;
  openNewDemandInvoiceModal: () => void;
  openAddPropertyModal: () => void;
}

const DemandPropertyButtons: React.FC<DemandPropertyButtonsProps> = ({
  iconOne,
  iconTwo,
  buttonTextOne,
  buttonTextTwo,
  openNewDemandInvoiceModal,
  openAddPropertyModal,
}) => {
  const { userRoleId } = useTokens();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleButtonClick = (callback: () => void) => {
    if (userRoleId !== 1) {
      setSnackbar({
        open: true,
        message: "You don't have permission",
        severity: "error",
      });
    } else {
      callback();
    }
  };

  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        className="flex items-center justify-between button-gradient-one space-x-1 px-2 py-2.5 border border-custom-color-two rounded shadow-custom-100"
        style={{ width: "48.5%" }}
        title={buttonTextOne}
        onClick={() => handleButtonClick(openNewDemandInvoiceModal)}
      >
        <span className="text-sm text-white">{iconOne}</span>
        <span
          className="font-medium text-left text-white ellipsis font-lexend"
          style={{ fontSize: "0.6875rem" }}
        >
          {buttonTextOne}
        </span>
      </button>
      <button
        type="button"
        className="flex items-center justify-between button-gradient-two space-x-1  px-2 py-2.5 border border-custom-color-two rounded shadow-custom-100"
        style={{ width: "48.5%" }}
        title={buttonTextTwo}
        onClick={() => handleButtonClick(openAddPropertyModal)}
      >
        <span className="text-sm text-primary-color">{iconTwo}</span>
        <span
          className="font-medium text-left text-primary-color ellipsis font-lexend"
          style={{ fontSize: "0.6875rem" }}
        >
          {buttonTextTwo}
        </span>
      </button>
      <CustomAlert
        isOpen={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        handleClose={handleSnackbarClose}
      />
    </div>
  );
};

export default DemandPropertyButtons;
