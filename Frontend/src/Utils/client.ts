import axios from 'axios';
import Cookies from 'js-cookie';

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

export function filterRecordsByKeyAndValue<T>(recordsArray: T[], key: keyof T, value: T[keyof T]): T[] {
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

export function filterStaffRecordsByRoleName(recordsArray: StaffRecord[], roleName: string): StaffRecord[] {
  return recordsArray.filter((record) => record.role.name === roleName);
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
      return 1;
    case "Admin":
      return 2;
    case "Enforcer":
      return 3;
    case "Officer":
      return 4;
    default:
      return null;
  }
};


export const fetcher = async (url: string, token: any) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
};

export const useTokens = () => {
  // Safely get and parse userData from cookies
  const userData = Cookies.get('userData');
  
  try {
    const parsedData = userData ? JSON.parse(userData) : null;
    // Safely access token
    return { token: parsedData?.token, userId: parsedData?.user?.id }
  } catch (error) {
    console.error('Error parsing userData cookie:', error);
    return { token: undefined, userId: undefined }
  }
}