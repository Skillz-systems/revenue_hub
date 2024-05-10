import React from "react";
import { DemandInvoiceTable, customTableData } from "../Index";

export default function DemandNotice() {
  return (
    <div>
      <hr className="border-0.5 mb-8 border-custom-grey-100" />
      <DemandInvoiceTable customTableData={customTableData.demandNotice} />
    </div>
  );
}
