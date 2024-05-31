import React, { useState, useEffect } from "react";
import { TransactionsTable, userData } from "../Components/Index";
import { useTokens } from "../Utils/client";
import axios from "axios";

const Transactions: React.FC = () => {
  const { token } = useTokens();
  const { staticInformation } = userData();
  const [transactionInformation, setTransactionInformation] =
    useState<any>(null);

  const fetchTransactions = async (dateFilter = "") => {
    try {
      const response = await axios.post(
        "https://api.revenuehub.skillzserver.com/api/payment",
        { date_filter: dateFilter },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("Success:", response.data.data);
        setTransactionInformation(response.data.data);
      } else {
        console.error("Unexpected status code:", response.status);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized:", error.response.data);
      } else {
        console.error("Error submitting form:", error);
      }
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="flex-col space-y-8">
      <hr className="border-0.5 mb-8 border-custom-grey-100" />
      {transactionInformation ? (
        <TransactionsTable
          staticInformation={staticInformation}
          transactionInformation={transactionInformation}
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Transactions;
