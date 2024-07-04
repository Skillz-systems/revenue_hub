import React, { useState } from 'react';
import { HiOutlineDotsHorizontal, HiUsers } from 'react-icons/hi';
import AddNewModal from './AddNewStreetModal';
import RowActions from './RowActions';
import formatHeaderKey from '../../Utils/FormatHeaderKey';

interface TableComponentProps {
  loading: boolean;
  tableData: any[];
  tableHeader: string[];
  endpoints: string;
  formFields: { label: string, name: string, type: string }[];
  postEndpoint: string;
  data: any;
}

const TableComponent: React.FC<TableComponentProps> = ({ loading, tableData, tableHeader, endpoints, formFields, postEndpoint, data }) => {
  const [openRowId, setOpenRowId] = useState<number | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);

  const showNewModal = () => {
    setIsNewModalOpen(true);
  };

  const hideNewModal = () => {
    setIsNewModalOpen(false);
  };

  const handleActionsClick = (rowId: number) => {
    console.log("Action", rowId)
    setOpenRowId(prevRowId => (prevRowId === rowId ? null : rowId));
  };

  const renderHeader = () => {
    return tableHeader.map((key, index) => (
      <th key={index} className="capitalize px-4 py-2 text-left border font-medium font-lexend text-gray-700 text-[10px]">
        {formatHeaderKey(key, true)}
      </th>
    ));
  };

  const renderTableData = (row: any, index: number, data:any="") => {
    console.log("info", data, row)
    return (
      <tr key={row.id} className="border-b hover:bg-gray-50">
        <td className="px-4 py-2 font-lexend text-gray-700 text-[15px]">{index + 1}</td>
        {tableHeader.map((key, i) => (
          <td key={i} className="px-4 py-2 font-lexend text-gray-700 text-[15px]">
            {row[key]}
          </td>
        ))}
        <td className="px-4 py-2 font-lexend text-gray-700 text-[15px] relative">
          <span
            className="relative px-2 py-2.5 rounded text-base hover:cursor-pointer"
            onClick={() => handleActionsClick(index)}
          >
            <HiOutlineDotsHorizontal />
            {openRowId === index && (
              <div className="absolute top-0 z-10 right-0 flex-col w-36 p-4 text-xs bg-white rounded shadow-md">
                <RowActions
                  endpoint={endpoints}
                  data={data}
                  onActionComplete={() => setOpenRowId(null)} // Close the actions when an action is complete
                />
              </div>
            )}
          </span>
        </td>
      </tr>
    );
  };

  if (loading) return <p className="text-center text-blue-500">Loading data, please wait...</p>;

  return (
    <div>
      <div className="flex items-center justify-end mb-4 gap-2">
        <button
          type="button"
          className="flex items-center justify-between p-2 space-x-1 border rounded button-gradient-one border-custom-color-two shadow-custom-100"
          style={{ width: "8%" }}
          title={`New ${endpoints}`}
          onClick={showNewModal}
        >
          <span className="text-sm text-white">
            <HiUsers />
          </span>
          <span className="font-medium text-left text-white ellipsis font-lexend" style={{ fontSize: "0.6875rem" }}>
            New {endpoints}
          </span>
        </button>
      </div>
      {isNewModalOpen && (
        <AddNewModal
          isOpen={isNewModalOpen}
          hideModal={hideNewModal}
          endpoints={endpoints}
          formFields={formFields}
          postEndpoint={postEndpoint}
        />
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left border font-medium font-lexend text-gray-700 text-[10px]">SN</th>
              {renderHeader()}
              <th className="px-4 py-2 text-left border font-medium font-lexend text-gray-700 text-[10px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => renderTableData(row, index, data[index]))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableComponent;
