import React from "react";
import { StaffTable, customTableData } from "../Index";

export default function Settings() {
  return (
    <div>
      <hr className="border-0.5 mb-8 border-custom-grey-100" />
      <StaffTable customTableData={customTableData.staff} />
    </div>
  );
}
