import React, { useState, useEffect } from "react";
import {
  LoadingSpinner,
  TransactionsTable,
  userData,
  CustomAlert,
} from "../Components/Index";
import { useTokens, useTriggerError } from "../Utils/client";
import axios, { AxiosError } from "axios";

const apiUrl = import.meta.env.VITE_API_URL as string;

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
  const [paginationMeta, setPaginationMeta] = useState({
    currentPage: 0,
    lastPage: 0,
    total: 0,
    perPage: 0,
  });
  const triggerError = useTriggerError();

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchTransactions = async (dateFilter = "") => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/payment`,
        { date_filter: dateFilter },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setTransactionInformation(response.data.data);
        setPaginationMeta({
          currentPage: response.data.meta.current_page,
          lastPage: response.data.meta.last_page,
          total: response.data.meta.total,
          perPage: response.data.meta.per_page,
        });
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
    } catch (error: any) {
      let message = "Internal Server Error";
      if (error.isAxiosError) {
        const axiosError = error as AxiosError;
        if (axiosError.code === "ERR_NETWORK") {
          message =
            "Network error. Please check your internet connection and try again.";
        } else if (axiosError.response) {
          switch (axiosError.response.status) {
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
            case 500:
              triggerError(error);
              break;
            default:
              break;
          }
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
          paginationMeta={paginationMeta}
          setPaginationMeta={setPaginationMeta}
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
