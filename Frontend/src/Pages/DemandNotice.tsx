import React, { useState, useEffect } from "react";
import { DemandInvoiceTable, LoadingSpinner, userData } from "../Components/Index";
import { useTokens } from "../Utils/client";
import axios from "axios";

export const DemandNotice: React.FC = () => {
  const { token } = useTokens();
  const [demandNoticeInformation, setDemandNoticeInformation] =
    useState<any>(null);
  const { staticInformation } = userData();

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
        console.log("Success:", response.data.data);
        setDemandNoticeInformation(response.data.data);
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
    </div>
  );
};

export default DemandNotice;
