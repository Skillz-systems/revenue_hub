import React from "react";
import { LoadingSpinner, StaffTable, userData } from "../Components/Index";
import PasswordAccountPortal from "../Components/ProjectLayout/PasswordAccountPortal";

export default function Settings() {
  const {
    staffInformation,
    staticInformation,
    staffSnackbar,
    handleStaffSnackbarClose,
    setStaffSnackbar,
  } = userData();

  return (
    <div className="flex-col w-full space-y-8 overflow-auto scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white">
      {staffInformation ? (
        <>
          {/* <PasswordAccountPortal>
            <PasswordAccountButtons />
          </PasswordAccountPortal> */}
          <StaffTable
            staticInformation={staticInformation}
            staffInformation={staffInformation}
            staffSnackbar={staffSnackbar}
            setStaffSnackbar={setStaffSnackbar}
            handleStaffSnackbarClose={handleStaffSnackbarClose}
          />
        </>
      ) : (
        <LoadingSpinner title="Loading Settings" />
      )}
    </div>
  );
}
