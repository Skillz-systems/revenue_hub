import React, { useEffect, useState } from 'react';
import apiCall from '../../../Api/apiCall';
import { CadastralZoneModal } from "./CadastralZoneModal";
import CadastralZoneRowActions from './CadastralZoneRowActions';
import { CustomAlert } from "../../Index";

export type CadastralZoneData = {
  id: string;
  name: string;
  rating_district: {
    id: number;
    name: string;
  } | null;
  created_at: string;
  updated_at: string;
};

type RatingDistrict = {
  id: string;
  name: string;
};

export const CadastralZoneTable = () => {
  const [tableData, setTableData] = useState<CadastralZoneData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ratingDistricts, setRatingDistricts] = useState<RatingDistrict[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetching = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall<{ data: CadastralZoneData[] }>({
        endpoint: "cadastral-zone",
        method: "get",
      });
      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: "Successfully fetched Cadastral Zone",
          severity: "success",
        });
        setTableData(response.data.data);
      }
    } catch (error) {
      setError("An error occurred while fetching data.");
      setSnackbar({
        open: true,
        message: "An error occurred while fetching Cadastral Zone data",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRatingDistricts = async () => {
    try {
      const response = await apiCall<{ data: RatingDistrict[] }>({
        endpoint: 'rating-district',
        method: 'get',
      });
      if (response.status === 200) {
        setRatingDistricts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching rating districts:', error);
    }
  };

  useEffect(() => {
    fetching();
    fetchRatingDistricts();
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
      <CadastralZoneModal ratingDistricts={ratingDistricts} /> 
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left border font-medium font-lexend text-gray-700 text-[10px]">SN</th>
              <th className="px-4 py-2 text-left border font-medium font-lexend text-gray-700 text-[10px]">Cadastral Zone Name</th>
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
                  <CadastralZoneRowActions
                    data={item}
                    ratingDistricts={ratingDistricts}
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