import React, { useState, useRef, useEffect } from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import apiCall from '../../../Api/apiCall';
import { FaTrash } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";

interface CategoryRowActionsProps {
  data: {
    id: string;
    name: string;
  };
  onActionComplete: () => void;
}


const CategoryRowActions: React.FC<CategoryRowActionsProps> = ({ data, onActionComplete }) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [viewDetails, setViewDetails] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState<boolean>(false);
  const [form, setForm] = useState<{ name: string }>({ name: data.name });
  const [viewData, setViewData] = useState<any>({});
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await apiCall({
        endpoint: `category/update/${data.id}`,
        method: 'put',
        data: { name: form.name },
      });

      if (response.status === 200) {
        onActionComplete();
        setUpdateData(false);
      } else {
        console.error('Failed to update:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error updating:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await apiCall({
        endpoint: `category/delete/${data.id}`,
        method: 'delete',
      });

      if (response.status === 200 || response.status === 204) {
        onActionComplete();
        setDeleteData(false);
      } else {
        console.error('Failed to delete:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleView = async () => {
    try {
      const response = await apiCall({
        endpoint: `category/view/${data.id}`,
        method: 'get',
      });
      if (response.status === 200) {
        setViewData(response.data.data);
        setViewDetails(true);
      } else {
        console.error('Failed to fetch data:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
      {showOptions && (
        <div ref={optionsRef} className="absolute space-y-2 top-0 z-10 flex-col w-36 p-4 text-xs bg-white rounded shadow-md -left-44 border-0.6 border-custom-grey-100 text-color-text-black font-lexend">
          <p
            className="hover:cursor-pointer mb-2 font-lexend text-gray-700 text-[10px]"
            onClick={handleView}
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
        </div>
      )}
      {!showOptions && <div onClick={() => setShowOptions(true)}><HiOutlineDotsHorizontal /></div>}

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
              <table className='w-full'>
                <tbody>
                  <tr className='border-b hover:bg-gray-50'>
                    <th className='text-left p-2'>ID:</th>
                    <td className='p-2'>{viewData.id}</td>
                  </tr>
                  <tr className='border-b hover:bg-gray-50'>
                    <th className='text-left p-2'>Name:</th>
                    <td className='p-2'>{viewData.name}</td>
                  </tr>
                  <tr className='border-b hover:bg-gray-50'>
                    <th className='text-left p-2'>Created At:</th>
                    <td className='p-2'>{new Date(viewData.created_at).toLocaleString()}</td>
                  </tr>
                  <tr className='border-b hover:bg-gray-50'>
                    <th className='text-left p-2'>Updated At:</th>
                    <td className='p-2'>{new Date(viewData.updated_at).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {updateData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Update Data</h2>
              <button onClick={() => setUpdateData(false)}>
                <span className="text-xl">&times;</span>
              </button>
            </div>
            <div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Category Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            <button onClick={handleUpdate} className="mt-4 px-4 py-2 bg-blue-900 text-white rounded">
              <GrUpdate />
            </button>
          </div>
        </div>
      )}

      {deleteData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Delete Data</h2>
              <button onClick={() => setDeleteData(false)}>
                <span className="text-xl">&times;</span>
              </button>
            </div>
            <p>Are you sure you want to delete <strong>{data.name}</strong> ? </p>
            <div className="mt-4 flex justify-end">
             
              <button onClick={handleDelete} className="px-4 py-2 bg-blue-900 text-white rounded">
              <FaTrash />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryRowActions;
