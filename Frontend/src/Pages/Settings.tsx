import React from "react";
import { LoadingSpinner, StaffTable, userData } from "../Components/Index";

export default function Settings() {
  const {
    staffInformation,
    staticInformation,
    staffSnackbar,
    handleStaffSnackbarClose,
    setStaffSnackbar,
  } = userData();

  return (
    <div className="flex-col space-y-8">
      {staffInformation ? (
        <StaffTable
          staticInformation={staticInformation}
          staffInformation={staffInformation}
          staffSnackbar={staffSnackbar}
          setStaffSnackbar={setStaffSnackbar}
          handleStaffSnackbarClose={handleStaffSnackbarClose}
        />
      ) : (
        <LoadingSpinner title="Loading Settings" />
      )}
    </div>
  );
}
