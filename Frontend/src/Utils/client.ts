import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useContext } from "react";
import { ErrorContext } from "../Context/ErrorContext";
import isOnline from "is-online";
interface NetworkStatus {
  isOnline: boolean;
}

export const networkStatus = async (): Promise<NetworkStatus | undefined> => {
  try {
    const online = await isOnline();
    return { isOnline: online };
  } catch (error) {
    return undefined;
  }
};

export function formatNumberWithCommas(number: number | string): string {
  // Convert the number to a string
  const numStr = String(number);

  // Split the string into integer and decimal parts (if any)
  const [integerPart, decimalPart] = numStr.split(".");

  // Add commas to the integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Combine the integer and decimal parts (if any)
  const formattedNumber = decimalPart
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;

  return formattedNumber;
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
};

export function filterRecordsByKeyAndValue<T>(
  recordsArray: T[],
  key: keyof T,
  value: T[keyof T]
): T[] {
  return recordsArray.filter((record) => record[key] === value);
}

interface StaffRecord {
  id: number;
  name: string;
  email: string;
  phone: string;
  zone: string;
  role: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export function filterStaffRecordsByRoleName(
  recordsArray: StaffRecord[],
  roleName: string
): StaffRecord[] {
  return recordsArray.filter((record) => record?.role?.name === roleName);
}

export function ScrollToTop(id: string): void {
  const topContainer = document.getElementById(id);
  if (topContainer) {
    topContainer.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

export const mapDesignationToRoleId = (designation: string): number | null => {
  switch (designation) {
    case "Manager":
      //can do anything
      return 1;
    case "Admin":
      //cant delete anything
      //can view payment, but cant see transaction page
      //cant see stats, can do other things for staff except delete and settings,
      return 2;
    case "Enforcer":
      //just view, dont perform any action
      return 3;
    case "Others":
      //just view, dont perform any action
      return 4;
    default:
      return null;
  }
};

export const fetcher = async (url: string, token: any,method:string="get") => {
  try {
    if (method == "post"){
      const response = await axios.post(url,{}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data
    }
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
 
    return response.data;
  } catch (error: any) {
    if (error.isAxiosError) {
      const axiosError = error as AxiosError;
      if (axiosError.code === "ERR_NETWORK") {
        const message =
          "Network error. Please check your internet connection and try again.";
        // alert(message);
      }
    } else {
      console.log("Failed to fetch data");
    }
  }
};

export const useTokens = () => {
  // Safely get and parse userData from cookies
  const userData = Cookies.get("userData");

  try {
    const parsedData = userData ? JSON.parse(userData) : null;
    // Safely access token
    return {
      token: parsedData?.token,
      userId: parsedData?.user?.id,
      userRoleId: parsedData?.user?.role?.id,
    };
  } catch (error) {
    console.error("Error parsing userData cookie:", error);
    return { token: undefined, userId: undefined, userRoleId: undefined };
  }
};

export const useTriggerError = () => {
  const { setHasError } = useContext(ErrorContext);

  const triggerError = (error: any) => {
    console.error("Error Boundary:", error);
    setHasError(error);
  };

  return triggerError;
};
