import React, { useEffect, useState } from 'react';
import apiCall from '../../../Api/apiCall';
import { RatingDistrictModal } from "./RatingDistrictModal";
import RatingDistrictRowActions from './RatingDistrictRowActions';
import { CustomAlert } from "../../Index";

export type RatingDistrictData = {
  id: string;
  name: string;
  office_zone: {
    id: number;
    name: string;
  } | null;
  created_at: string;
  updated_at: string;
};

export const RatingDistrictTable = () => {
  const [tableData, setTableData] = useState<RatingDistrictData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [officeZones, setOfficeZones] = useState<{ id: string, name: string }[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const fetching = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall<{ data: RatingDistrictData[] }>({
        endpoint: "rating-district",
        method: "get",
      });
      if (response.status === 200) {
        setTableData(response.data.data);
        setSnackbar({
          open: true,
          message: "Successfully fetched Rating Districts",
          severity: "success",
        });
      }
    } catch (error) {
      setError("An error occurred while fetching data.");
      setSnackbar({
        open: true,
        message: "An error occurred while fetching Rating Districts data",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOfficeZones = async () => {
    try {
      const response = await apiCall({
        endpoint: 'office-zone',
        method: 'get',
      });
      if (response.status === 200) {
        setOfficeZones(response.data.data);
        console.log("officeZones RatingDistrictTable Line 44", officeZones);
      }
    } catch (error) {
      console.error('Error fetching office zones:', error);
    }
  };

  useEffect(() => {
    fetching();
    fetchOfficeZones();
  }, []);

  const handleActionComplete = () => {
    fetching();
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) return <p className="text-center text-blue-500">Loading data, please wait...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="relative">
      <RatingDistrictModal officeZones={officeZones} />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left border font-medium font-lexend text-gray-700 text-[10px]">SN</th>
              <th className="px-4 py-2 text-left border font-medium font-lexend text-gray-700 text-[10px]">Rating District Name</th>
              <th className="px-4 py-2 text-left border font-medium font-lexend text-gray-700 text-[10px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={item.id || index} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-lexend text-gray-700 text-[15px]">{index + 1}</td>
                <td className="px-4 py-2 font-lexend text-gray-700 text-[15px]">
                  {item.name}
                </td>
                <td className="px-4 py-2 font-lexend text-gray-700 text-[15px] relative">
                  <RatingDistrictRowActions
                    data={item}
                    officeZones={officeZones}
                    onActionComplete={handleActionComplete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CustomAlert
        isOpen={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        handleClose={handleSnackbarClose}
      />
    </div>
  );
};
