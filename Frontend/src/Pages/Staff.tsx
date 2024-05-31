import React from "react";
import { StaffTable, userData } from "../Components/Index";

const Staff: React.FC = () => {
  const { staffInformation, staticInformation } = userData();

  return (
    <div className="flex-col space-y-8">
      <hr className="border-0.5 mb-8 border-custom-grey-100" />
      {staffInformation ? (
        <StaffTable
          staticInformation={staticInformation}
          staffInformation={staffInformation}
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Staff;
