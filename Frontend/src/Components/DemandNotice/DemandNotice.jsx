import React from "react";
import { CustomTable, customTableData } from "../Index";

export default function DemandNotice() {
  return (
    <div>
      <CustomTable customTableData={customTableData.demandNotice} />
    </div>
  );
}
