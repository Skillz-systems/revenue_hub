import React, { useState, useRef, useEffect } from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import apiCall from '../../../Api/apiCall';

interface RatingDistrict {
  id: number;
  name: string;
  office_zone: string | null;
}

interface CadastralZone {
  id: number;
  name: string;
  rating_district: RatingDistrict;
  created_at: string;
  updated_at: string;
}

export type Street = {
  id: string;
  name: string;
  cadastral_zone: CadastralZone;
  created_at: string;
  updated_at: string;
}

interface Cadastral {
  id: string;
  name: string;
}

interface StreetRowActionsProps {
  data: Street;
  cadastrals: { id: string; name: string }[];
  onActionComplete: () => void;
  
}

interface ViewData {
  id: number;
  name: string;
  cadastral_zone: {
    name: string;
    rating_district: {
      name: string;
    };
  };
  created_at: string;
  updated_at: string;
}

const StreetRowActions: React.FC<StreetRowActionsProps> = ({ data, onActionComplete, cadastrals }) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [viewDetails, setViewDetails] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState<boolean>(false);
  const [form, setForm] = useState<{ name: string; cadastral_zone_id: string }>({
    name: data.name,
    cadastral_zone_id: data.cadastral_zone.id.toString()
  });
  const [viewData, setViewData] = useState<ViewData | null>(null);
  const [dropDownValue, setDropdownValue] = useState<Cadastral[]>(cadastrals);
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const stringifiedForm = Object.fromEntries(
        Object.entries(form).map(([key, value]) => [key, String(value)])
      );

      const response = await apiCall({
        endpoint: `street/update/${data.id}`,
        method: 'put',
        data: stringifiedForm,
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
        endpoint: `street/delete/${data.id}`,
        method: 'delete',
      });

      if (response.status === 200 || response.status === 204) {
        console.log("deleted street with ID: ", data.id);
        console.log("deleted street DATA: ", data);
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
        endpoint: `street/view/${data.id}`,
        method: 'get',
      });
      setViewData(response.data.data as ViewData);
      setViewDetails(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderFormField = (name: string, type: string, label: string) => {
    switch (type) {
      case 'dropdown':
        return (
          <select
            name={name}
            value={form[name] as string}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          >
            {dropDownValue.map((value: Cadastral) => (
              <option key={value.id} value={value.id}>{value.name}</option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type={type}
            name={name}
            value={form[name] as string}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          />
        );
    }
  };

  const renderUpdateForm = () => (
    <>
      <div className="mb-4">
        <label className="block font-semibold mb-2">Street Name</label>
        {renderFormField('name', 'text', 'Street Name')}
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-2">Cadastral Zone</label>
        {renderFormField('cadastral_zone_id', 'dropdown', 'Cadastral Zone')}
      </div>
    </>
  );

  return (
    <>
      {showOptions && (
        <div ref={optionsRef} className="absolute space-y-2 top-0 z-10 right-4 flex-col w-36 p-4 text-xs bg-white rounded shadow-md  border border-red-600">
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

      {viewDetails && viewData && (
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
                    <th className='text-left p-2'>Cadastral Zone:</th>
                    <td className='p-2'>{viewData.cadastral_zone.name}</td>
                  </tr>
                  <tr className='border-b hover:bg-gray-50'>
                    <th className='text-left p-2'>Rating District:</th>
                    <td className='p-2'>{viewData.cadastral_zone.rating_district.name}</td>
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
            <div>{renderUpdateForm()}</div>

            <button onClick={handleUpdate} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
              Update
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
              <button onClick={() => setDeleteData(false)} className="mr-2 px-4 py-2 bg-gray-300 text-black rounded">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StreetRowActions;
