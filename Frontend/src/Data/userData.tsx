import React, { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import Cookies from "js-cookie";
import { fetcher } from "../Utils/client";
import { StatisticsData } from "./types";

const userData = () => {
  const [accountInformation, setAccountInformation] = useState<any>(null);
  const [staffInformation, setStaffInformation] = useState<any>(null);
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);

  // Safely get and parse userData from cookies
  const userData = Cookies.get("userData");
  let token: string | undefined;
  let userId: string | undefined;

  try {
    const parsedData = userData ? JSON.parse(userData) : null;
    // Safely access token
    token = parsedData?.token;
    userId = parsedData?.user?.id;
  } catch (error) {
    console.error("Error parsing userData cookie:", error);
    token = undefined;
    userId = undefined;
  }

  const { data: staff, error: staffError } = useSWR(
    token && userId
      ? `https://api.revenuehub.skillzserver.com/api/staff/${userId}`
      : null, // Only fetch if token and userId exists
    (url) => fetcher(url, token)
  );

  const { data: allStaff, error: allStaffError } = useSWR(
    token ? "https://api.revenuehub.skillzserver.com/api/staff" : null, // Only fetch if token exists
    (url) => fetcher(url, token)
  );

  const fetchStatistics = async (dateFilter = "") => {
    try {
      const response = await axios.post(
        "https://api.revenuehub.skillzserver.com/api/statistic/all-yearly-data",
        { date_filter: dateFilter }, // Data payload
        {
          headers: {
            Authorization: `Bearer ${token}`, // Headers
          },
        }
      );
      if (response.status === 200) {
        setStatistics(response.data.data);
      } else {
        console.error("Unexpected status code:", response.status);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized:", error.response.data);
      } else {
        console.error("Error fetching statistics:", error);
      }
    }
  };

  useEffect(() => {
    if (staff) {
      setAccountInformation(staff.data);
    }
    if (allStaff) {
      setStaffInformation(allStaff.data);
    }
  }, [staff, allStaff]);

  useEffect(() => {
    if (staffError) {
      console.error("Error fetching staff information:", staffError);
    }
    if (allStaffError) {
      console.error("Error fetching All Staff information:", allStaffError);
    }
  }, [staffError, allStaffError]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const deleteStaffById = async (staffId: number) => {
    try {
      const response = await axios.delete(
        `https://api.revenuehub.skillzserver.com/api/staff/${staffId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add your authorization token if needed
          },
        }
      );

      if (response.status === 200) {
        // Remove the deleted staff from the state
        setStaffInformation((prevStaff) =>
          prevStaff.filter((staff) => staff.id !== staffId)
        );
        alert("Staff deleted successfully");
      } else {
        alert("Failed to delete staff");
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      alert("An error occurred while deleting the staff");
    }
  };

  return {
    accountInformation,
    staffInformation,
    statistics,
    deleteStaffById,
    cadestralZones,
    staticInformation,
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
        name: "Manually confirmed Transactions",
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

export { userData, staticInformation };
