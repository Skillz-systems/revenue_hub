import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { fetcher, useTokens, useTriggerError } from "../Utils/client";
import { StatisticsData } from "./types";
import { rootStore } from "../Stores/rootstore";

const apiUrl = import.meta.env.VITE_API_URL as string;

const userData = () => {
  const [accountInformation, setAccountInformation] = useState<any>(null);
  const [staffInformation, setStaffInformation] = useState<any>(null);
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [staffSnackbar, setStaffSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const triggerError = useTriggerError();

  const { token, userId } = useTokens();

  const handleStaffSnackbarClose = () => {
    setStaffSnackbar({ ...staffSnackbar, open: false });
  };

  const { data: staff, error: staffError } = useSWR(
    token && userId ? `${apiUrl}/api/staff/${userId}` : null, // Only fetch if token and userId exists
    (url) => fetcher(url, token)
  );

  const { data: allStaff, error: allStaffError } = useSWR(
    token ? `${apiUrl}/api/staff` : null, // Only fetch if token exists
    (url) => fetcher(url, token)
  );

  const fetchStatistics = async (dateFilter = "") => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/statistic/all-yearly-data`,
        { date_filter: dateFilter }, // Data payload
        {
          headers: {
            Authorization: `Bearer ${token}`, // Headers
          },
        }
      );
      if (response.status === 200) {
        setStatistics(response.data.data);
      }
    } catch (error: any) {
      if (error.response?.status === 500) {
        triggerError(error);
      } else {
        console.error(error.message);
      }
    } finally {
      rootStore.updateDemandList(false);
    }
  };

  useEffect(() => {
    if (staff) {
      setAccountInformation(staff.data);
      setStaffSnackbar({
        open: true,
        message: "Successfully loaded staff",
        severity: "success",
      });
    }
    if (allStaff) {
      setStaffInformation(allStaff.data);
      setStaffSnackbar({
        open: true,
        message: "Successfully loaded staff list",
        severity: "success",
      });
    }
  }, [staff, allStaff]);

  useEffect(() => {
    if (staffError) {
      setStaffSnackbar({
        open: true,
        message: "Error fetching staff information",
        severity: "error",
      });
    }
    if (allStaffError) {
      setStaffSnackbar({
        open: true,
        message: "Error fetching All Staff information",
        severity: "error",
      });
    }
  }, [staffError, allStaffError]);

  useEffect(() => {
    fetchStatistics();
    if (rootStore.refreshDemandNotice) {
      fetchStatistics();
    }
  }, [rootStore.refreshDemandNotice]);

  const deleteStaffById = async (staffId: number) => {
    try {
      const response = await axios.delete(`${apiUrl}/api/staff/${staffId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add your authorization token if needed
        },
      });

      if (response.status === 200) {
        setStaffInformation((prevStaff: any) =>
          prevStaff.filter((staff: any) => staff.id !== staffId)
        );
        setStaffSnackbar({
          open: true,
          message: "Staff deleted successfully",
          severity: "success",
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setStaffSnackbar({
          open: true,
          message: "Unexpected status code",
          severity: "warning",
        });
      }
    } catch (error: any) {
      let message = "Internal Server Error";
      if (error.response) {
        switch (error.response?.status) {
          case 400:
            message = "Bad request. Staff Id is missing.";
            break;
          case 401:
            message = "You are unauthorized";
            break;
          case 403:
            message = "You are forbidden";
            break;
          case 404:
            message = "Staff is not found";
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
      setStaffSnackbar({ open: true, message, severity: "error" });
    }
  };

  return {
    accountInformation,
    staffInformation,
    statistics,
    deleteStaffById,
    cadestralZones,
    staticInformation,
    staffSnackbar,
    setStaffSnackbar,
    handleStaffSnackbarClose,
  };
};

const cadestralZones = [
  "Apo",
  "Asokoro",
  "Bwari",
  "Central Area",
  "Chika",
  "Dakibiya",
  "Dakwo",
  "Dei-Dei",
  "Duboyi",
  "Durumi",
  "Dutse",
  "Gaduwa",
  "Galadimawa",
  "Garki",
  "Gudu",
  "Guzape",
  "Gwagwa",
  "Gwagwalada",
  "Gwarinpa",
  "Idu",
  "Jabi",
  "Jahi",
  "Jikwoyi",
  "Kabusa",
  "Kado",
  "Kajini",
  "Karsana",
  "Karu",
  "Katampe",
  "Kaura",
  "Keffi",
  "Kubwa",
  "Kuchigworo",
  "Kukwaba",
  "Lokogoma",
  "Lugbe",
  "Mabushi",
  "Maitama",
  "Mbora",
  "Mpape",
  "Nyanya",
  "Pyakasa",
  "Utako",
  "Waru-Pouma",
  "Wumba",
  "Wuse",
  "Wuye",
  "Zuba",
];

const paginationStyles = {
  containerClassName: "flex flex-wrap font-lexend space-x-2",
  activeClassName:
    "flex items-center justify-center px-2.5 w-[32px] h-[32px] bg-custom-blue-200 border border-primary-color rounded ",
  activeLinkClassName: "text-sm text-primary-color font-mulish font-bold",
  previousClassName:
    "flex items-center justify-center h-[32px] px-2.5 border border-divider-grey rounded",
  previousLinkClassName: "text-sm text-color-text-one",
  nextClassName:
    "flex items-center justify-center h-[32px] px-2.5 border border-divider-grey rounded",
  nextLinkClassName: "text-sm text-color-text-one",
  pageClassName:
    "flex items-center justify-center w-[32px] h-[32px] px-2.5 border border-divider-grey rounded",
  pageLinkClassName: "text-sm text-color-text-two font-mulish",
  breakClassName:
    "flex items-center justify-center h-[32px] px-2 border border-divider-grey rounded",
  breakLinkClassName: "text-base text-color-text-two font-mulish",
};

const propertyUse = ["Commercial", "Residential", "School"];

const staticInformation = {
  cadestralZones: cadestralZones,
  propertyUse: propertyUse,
  demandNotice: {
    menu: [
      {
        id: 1,
        name: "All Demand Notices",
      },
      {
        id: 2,
        name: "Paid Demand Notices",
      },
      {
        id: 3,
        name: "Unpaid Demand Notices",
      },
      {
        id: 4,
        name: "Expired Demand Notices",
      },
    ],
    columns: [
      { id: 1, name: "PIN" },
      { id: 2, name: "ADDRESS" },
      { id: 3, name: "DATE" },
      { id: 4, name: "PROPERTY USE" },
      { id: 5, name: "CADESTRAL ZONE" },
      { id: 6, name: "RATE PAYABLE" },
      { id: 7, name: "PAYMENT STATUS" },
      { id: 8, name: "ACTIONS" },
    ],
  },
  transactions: {
    menu: [
      {
        id: 1,
        name: "All Transactions",
      },
      {
        id: 2,
        name: "Manually Confirmed Transactions",
      },
    ],
    columns: [
      { id: 1, name: "DEMAND NOTICE NUMBER" },
      { id: 2, name: "PIN" },
      { id: 3, name: "ADDRESS" },
      { id: 4, name: "TYPE" },
      { id: 5, name: "RATE PAYABLE" },
      { id: 6, name: "DATE PAID" },
      { id: 7, name: "ACTIONS" },
    ],
  },
  staff: {
    menu: [
      {
        id: 1,
        name: "All Staff",
      },
      {
        id: 2,
        name: "All Managers",
      },
      {
        id: 3,
        name: "All Officers",
      },
    ],
    columns: [
      { id: 1, name: "STAFF ID" },
      { id: 2, name: "FULL NAME" },
      { id: 3, name: "EMAIL" },
      { id: 4, name: "PHONE NUMBER" },
      { id: 5, name: "DESIGNATION" },
      { id: 6, name: "ACTIONS" },
    ],
  },
};

export { userData, staticInformation, paginationStyles };
