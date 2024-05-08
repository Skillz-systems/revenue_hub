import React from "react";
import { DemandInvoiceTable, customTableData } from "../Index";

export default function DemandNotice() {
  return (
    <div>
      <DemandInvoiceTable customTableData={customTableData.demandNotice} />
    </div>
  );
}
