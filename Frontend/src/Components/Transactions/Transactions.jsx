import React from "react";
import { TransactionsTable, customTableData } from "../Index";

export default function Transactions() {
  return (
    <div>
      <TransactionsTable customTableData={customTableData.transactions} />
    </div>
  );
}
