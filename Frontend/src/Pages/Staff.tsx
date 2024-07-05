import React from "react";
import { LoadingSpinner, StaffTable, userData } from "../Components/Index";

const Staff: React.FC = () => {
  const {
    staffInformation,
    staticInformation,
    staffSnackbar,
    handleStaffSnackbarClose,
    setStaffSnackbar,
  } = userData();

  return (
    <div className="flex-col w-full space-y-8 overflow-auto scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white">
      <hr className="border-0.5 mb-8 border-custom-grey-100" />
      {staffInformation ? (
        <StaffTable
          staticInformation={staticInformation}
          staffInformation={staffInformation}
          staffSnackbar={staffSnackbar}
          setStaffSnackbar={setStaffSnackbar}
          handleStaffSnackbarClose={handleStaffSnackbarClose}
        />
      ) : (
        <LoadingSpinner title="Loading Staff List" />
      )}
    </div>
  );
};

export default Staff;
