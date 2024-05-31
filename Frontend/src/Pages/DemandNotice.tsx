import React, { useState, useEffect } from "react";
import {
  DemandInvoiceTable,
  LoadingSpinner,
  userData,
  CustomAlert,
} from "../Components/Index";
import { useTokens } from "../Utils/client";
import axios from "axios";

export const DemandNotice: React.FC = () => {
  const { token } = useTokens();
  const [demandNoticeInformation, setDemandNoticeInformation] =
    useState<any>(null);
  const { staticInformation } = userData();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchDemandNotices = async (dateFilter = "") => {
    try {
      const response = await axios.post(
        "https://api.revenuehub.skillzserver.com/api/demand-notice",
        { date_filter: dateFilter },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setDemandNoticeInformation(response.data.data);
        setSnackbar({
          open: true,
          message: "Demand notices fetched successfully",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Unexpected status code",
          severity: "warning",
        });
      }
    } catch (error) {
      let message = "Internal Server Error";
      if (error.response) {
        switch (error.response.status) {
          case 400:
            message = "Bad request";
            break;
          case 401:
            message = "You are unauthenticated";
            break;
          case 403:
            message = "You are unauthorized";
            break;
          default:
            break;
        }
      }
      setSnackbar({ open: true, message, severity: "error" });
    }
  };

  useEffect(() => {
    fetchDemandNotices();
  }, []);

  return (
    <div className="flex-col space-y-8">
      <hr className="border-0.5 mb-8 border-custom-grey-100" />
      {demandNoticeInformation ? (
        <DemandInvoiceTable
          staticInformation={staticInformation}
          demandNoticeInformation={demandNoticeInformation}
        />
      ) : (
        <LoadingSpinner title="Loading Demand Notices" />
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

export default DemandNotice;
