import React from "react";
import { LoadingSpinner, StaffTable, userData } from "../Components/Index";

export default function Settings() {
  const { staffInformation, staticInformation } = userData();

  return (
    <div className="flex-col space-y-8">
      {staffInformation ? (
        <StaffTable
          staticInformation={staticInformation}
          staffInformation={staffInformation}
        />
      ) : (
        <LoadingSpinner title="Loading Settings" />
      )}
    </div>
  );
}
