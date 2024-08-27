// TableComponent.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HiOutlineDotsHorizontal, HiUsers } from 'react-icons/hi';
import AddNewStreetModal from './AddNewStreetModal';
import apiCall from '../../Api/apiCall';
import formatHeaderKey from '../../Utils/FormatHeaderKey';

interface TableData {
  id: number;
  name: string;
  zoneId?: number;
}

interface TableComponentProps {
  loading: boolean;
  tableData: any[];
  tableHeader: string[];
}

const TableComponent: React.FC<TableComponentProps> = ({ loading = false, tableData, tableHeader }) => {
  const [edit, setEdit] = useState<number | null>(null);
  const [isNewStreetModalOpen, setIsNewStreetModalOpen] = useState<boolean>(false);


  const showNewStreetModal = () => {
    setIsNewStreetModalOpen(true);
  };

  const hideNewStreetModal = () => {
    setIsNewStreetModalOpen(false);
  };


  if (loading) return <p className="text-center text-blue-500">Loading data, please wait...</p>;
  // if (error) return <p className="text-center text-red-500">{error}</p>;
   const renderHeader:any= async (row)=> {
    const formatted =await  tableHeader.map(key => formatHeaderKey(key, true));
                formatted.map((item, index) => {
                 
               return (<td className="px-4 py-2 font-lexend text-gray-700 text-[15px]">{row[item]} </td> 
                )
              })
   }
  return (
    <div>
      <div className="flex items-center justify-end mb-4 gap-2">
        <button
          type="button"
          className="flex items-center justify-between p-2 space-x-1 border rounded button-gradient-one border-custom-color-two shadow-custom-100"
          style={{ width: "8%" }}
          title="New District"
          onClick={showNewStreetModal}
        >
          <span className="text-sm text-white">
            <HiUsers />
          </span>
          <span
            className="font-medium text-left text-white ellipsis font-lexend"
            style={{ fontSize: "0.6875rem" }}
          >
            New Street
          </span>
        </button>
      </div>
      {isNewStreetModalOpen && (
        <AddNewStreetModal
          isOpen={isNewStreetModalOpen}
          hideModal={hideNewStreetModal}
        />
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              {tableHeader.map((item, index) => (
                <th key={index} className=" capitalize px-4 py-2 text-left border font-medium font-lexend text-gray-700 text-[10px]">{item || "Id"}</th>
              ))}
              <th className="px-4 py-2 text-left border font-medium font-lexend text-gray-700 text-[10px]">Actions</th>
            </tr>

          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                {renderHeader(row)}
                <td className="px-4 py-2 font-lexend text-gray-700 text-[15px]">
                  <span
                    className="relative px-2 py-2.5 rounded text-base hover:cursor-pointer"
                    onClick={() => setEdit(row.id)}
                    onBlur={() => setEdit(null)}  // Added onBlur event
                    tabIndex={0}  // Added tabIndex attribute
                  >
                    <HiOutlineDotsHorizontal />
                    {edit === row.id && (
                      <div
                        className="absolute top-0 z-10 right-4 flex-col w-36 p-4 text-xs bg-white rounded shadow-md"
                      >
                        <p className="hover:cursor-pointer mb-2 font-lexend text-gray-700 text-[10px]">View Details</p>
                        <p className="hover:cursor-pointer font-lexend text-gray-700 text-[10px]">Delete</p>
                      </div>
                    )}
                  </span>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableComponent;
