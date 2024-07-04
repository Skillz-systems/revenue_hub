import React, { useState } from 'react';
import apiCall from '../../Api/apiCall';

interface RowActionsProps {
  endpoint: string;
  data: any;
  onActionComplete: () => void;
}

const RowActions: React.FC<RowActionsProps> = ({ endpoint, data, onActionComplete }) => {
  const [viewDetails, setViewDetails] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState<boolean>(false);
  const [form, setForm] = useState<{ [key: string]: string | number }>(data);
  const [viewData, setViewData] = useState<object>({})

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await apiCall({
        endpoint: `${endpoint}/${data.id}`,
        method: 'put',
        data: form,
      });
      setUpdateData(false);
      onActionComplete();
    } catch (error) {
      console.error('Error updating:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await apiCall({
        endpoint: `${endpoint}/${data.id}`,
        method: 'delete',
      });
      setDeleteData(false);
      onActionComplete();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };
  
  const handleView = async (data:any) => {
    setViewDetails(true)
    try {

   let viewDatas =   await apiCall({
        endpoint: `${endpoint.toLowerCase()}/view/${data.id}`,
        method: 'get',
      });
      setViewData(viewDatas);
      console.log("things", viewData)
      setViewDetails(true)
      
    } catch (error) {
      console.error('Error fetchingData:', error);
    }
  };
  const renderView = (mainData:any) => {
  
    let data:any = Object.keys(mainData);
  
    return (
      <table>
        {data.map((value:any) => {
          <tr>
            <td>{value}</td>
            <td>
              {typeof mainData[value] == "object"
                ? mainData[value].name
                : mainData[value]}
            </td>
          </tr>;
        })}
      </table>
    );
    
  
  }

  return (
    <>
      <p
        className="hover:cursor-pointer mb-2 font-lexend text-gray-700 text-[10px]"
        onClick={() => handleView(data)}
      >
        View Details
      </p>
      <p
        className="hover:cursor-pointer mb-2 font-lexend text-gray-700 text-[10px]"
        onClick={() => setUpdateData(true)}
      >
        Update
      </p>
      <p
        className="hover:cursor-pointer font-lexend text-gray-700 text-[10px]"
        onClick={() => setDeleteData(true)}
      >
        Delete
      </p>

      {viewDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">View Details</h2>
              <button onClick={() => setViewDetails(false)}>
                <span className="text-xl">&times;</span>
              </button>
            </div>
            <div>
              abcdn
            </div>
          </div>
        </div>
      )}
      {updateData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Update</h2>
              <button onClick={() => setUpdateData(false)}>
                <span className="text-xl">&times;</span>
              </button>
            </div>
            <form>
              {Object.keys(form).map((key) => (
                <div key={key} className="mb-4">
                  <label className="block font-semibold mb-2">{key}</label>
                  <input
                    type="text"
                    name={key}
                    value={form[key]}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={handleUpdate}
                className="w-full bg-blue-500 text-white py-2 rounded"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}
      {deleteData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Delete Confirmation</h2>
              <button onClick={() => setDeleteData(false)}>
                <span className="text-xl">&times;</span>
              </button>
            </div>
            <p className="mb-4">Are you sure you want to delete this record?</p>
            <button
              type="button"
              onClick={handleDelete}
              className="w-full bg-red-500 text-white py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </>
    
  );
};

export default RowActions;
