import React, { useState, useEffect } from "react";
import {
  DemandInvoiceTable,
  CustomAlert,
} from "../Components/Index";
import { useTokens, useTriggerError } from "../Utils/client";
import { observer } from "mobx-react-lite";


export const DemandNotice: React.FC = observer(() => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const triggerError = useTriggerError();

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };



  return (
    <div className="flex-col w-full space-y-8 overflow-auto scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white">
      <hr className="border-0.5 mb-8 border-custom-grey-100" />
      <DemandInvoiceTable />
      <CustomAlert
        isOpen={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        handleClose={handleSnackbarClose}
      />
    </div>
  );
});

export default DemandNotice;
