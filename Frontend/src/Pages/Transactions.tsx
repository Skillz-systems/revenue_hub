import React, { useState, useEffect } from "react";
import {
  LoadingSpinner,
  TransactionsTable,
  userData,
  CustomAlert,
} from "../Components/Index";
import { useTokens } from "../Utils/client";
import axios from "axios";

const Transactions: React.FC = () => {
  const { token } = useTokens();
  const { staticInformation } = userData();
  const [transactionInformation, setTransactionInformation] =
    useState<any>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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
        setTransactionInformation(response.data.data);
        setSnackbar({
          open: true,
          message: "Successfuly fetched all transactions",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message:
            "Unexpected status code. Something went wrong please try again.",
          severity: "warning",
        });
      }
    } catch (error) {
      let message = "Internal Server Error";
      if (error.response) {
        switch (error.response.status) {
          case 400:
            message = "Bad request. Property Id is missing.";
            break;
          case 401:
            message = "You are unauthorized";
            break;
          case 403:
            message = "You are forbidden";
            break;
          case 404:
            message = "Payment not found";
            break;
          case 429:
            message = "Too many requests made. Refreshing in 3 seconds";
            setTimeout(() => {
              window.location.reload();
            }, 3000);
            break;
          default:
            break;
        }
      }
      setSnackbar({ open: true, message, severity: "error" });
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
        <LoadingSpinner title="Loading Transactions" />
      )}
      <CustomAlert
        isOpen={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        handleClose={handleSnackbarClose}
      />
    </div>
  );
};

export default Transactions;
