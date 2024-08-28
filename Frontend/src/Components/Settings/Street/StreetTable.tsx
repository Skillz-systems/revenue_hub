import React, { useEffect, useState } from 'react';
import apiCall from '../../../Api/apiCall';
import { StreetModal } from "./StreetModal";
import StreetRowActions, {Street, CadastralZone, ViewData} from './StreetRowActions';
import { CustomAlert } from "../../Index";


export type StreetData = {
  name: string;
  id?: string;
  
};

export const StreetTable = () => {
  const [tableData, setTableData] = useState<StreetData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cadastralZones, setCadastralZones] = useState<{ id: string, name: string }[]>([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetching = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall<{ data: StreetData[] }>({
        endpoint: "street",
        method: "get",
      });
      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: "Successfully fetched streets",
          severity: "success",
        });
        setTableData(response.data.data);
        console.log("28 Street TableData",response.data.data)
      }
    } catch (error) {
      setError("An error occurred while fetching data.");
      setSnackbar({
        open: true,
        message: "An error occurred while fetching Streets data",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  

  const fetchCadastralZones = async () => {
    try {
      const response = await apiCall({
        endpoint: 'cadastral-zone',
        method: 'get',
      });
      if (response.status === 200) {
        setCadastralZones(response?.data?.data);
        console.log("cadastralZones StreetTable Line 44",cadastralZones)
      }
    } catch (error) {
      console.error('Error fetching cadastral zones:', error);
    }
  };

  useEffect(() => {
    fetching();
    fetchCadastralZones()
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
      <StreetModal    cadastrals={cadastralZones} />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left border font-medium font-lexend text-gray-700 text-[10px]">SN</th>
              <th className="px-4 py-2 text-left border font-medium font-lexend text-gray-700 text-[10px]">Street Name</th>
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
                  <StreetRowActions
                    data={item}
                    cadastrals={cadastralZones}
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
