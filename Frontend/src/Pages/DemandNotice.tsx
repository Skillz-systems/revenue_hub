import React, { useState, useEffect } from "react";
import {
  DemandInvoiceTable,
  LoadingSpinner,
  userData,
  CustomAlert,
} from "../Components/Index";
import { useTokens, useTriggerError } from "../Utils/client";
import axios, { AxiosError } from "axios";
import { observer } from "mobx-react-lite";
import { rootStore } from "../Stores/rootstore";

const apiUrl = import.meta.env.VITE_API_URL as string;

export const DemandNotice: React.FC = observer(() => {
  const { token } = useTokens();
  const [demandNoticeInformation, setDemandNoticeInformation] =
    useState<any>(null);
  const { staticInformation } = userData();
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

  const fetchDemandNotices = async (dateFilter = "") => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/demand-notice`,
        { date_filter: dateFilter },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setDemandNoticeInformation(response.data.data);
        setPaginationMeta({
          currentPage: response.data.meta.current_page,
          lastPage: response.data.meta.last_page,
          total: response.data.meta.total,
          perPage: response.data.meta.per_page,
        });
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
              message = "Bad request";
              break;
            case 401:
              message = "You are unauthorized";
              break;
            case 403:
              message = "You are forbidden";
              break;
            case 429:
              message = "Too many requests made. Refreshing in 3 seconds";
              setTimeout(() => {
                window.location.reload();
              }, 3000);
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
    } finally {
      rootStore.refreshDemandNotice && rootStore.updateDemandList(false);
    }
  };

  useEffect(() => {
    fetchDemandNotices();
    if (rootStore.refreshDemandNotice) {
      fetchDemandNotices();
    }
  }, [rootStore.refreshDemandNotice]);

  return (
    <div className="flex-col w-full space-y-8 overflow-auto scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white">
      <hr className="border-0.5 mb-8 border-custom-grey-100" />
      {demandNoticeInformation ? (
        <DemandInvoiceTable
          staticInformation={staticInformation}
          demandNoticeInformation={demandNoticeInformation}
          paginationMeta={paginationMeta}
          setPaginationMeta={setPaginationMeta}
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
});

export default DemandNotice;
