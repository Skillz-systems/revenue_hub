import React from "react";
import { TransactionsTable, customTableData } from "../Index";

export default function Transactions() {
  return (
    <div>
      <hr className="border-0.5 mb-8 border-custom-grey-100" />
      <TransactionsTable customTableData={customTableData.transactions} />
    </div>
  );
}
