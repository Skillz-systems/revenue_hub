import React, { useState } from 'react';
import { HiX } from 'react-icons/hi';
import apiCall from '../../Api/apiCall';

interface AddNewStreetModalProps {
  isOpen: boolean;
  hideModal: () => void;
}

const AddNewStreetModal: React.FC<AddNewStreetModalProps> = ({ isOpen, hideModal }) => {
  if (!isOpen) return null;

  const [form, setForm] = useState({
    name: "",
    cadastral_zone_id: ""
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitForm = async () => {
    try {
      if (!form.name || !form.cadastral_zone_id) {
        alert("All fields are required.");
        console.log("Form submission prevented: All fields are required.");
        return;
      }

      console.log("Submitting form data:", form);

      const response = await apiCall<{}>({
        endpoint: "/street/create",
        method: "post",
        data: form,
      });

      if (response.status === 201) {
        console.log('Street added successfully:', response.data);
        setForm({ name: "", cadastral_zone_id: "" }); 
        hideModal(); 
      } 
    } catch (error) {
      console.error('Error adding street:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Street</h2>
          <button onClick={hideModal}>
            <HiX className="text-xl" />
          </button>
        </div>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Street Name</label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter street name"
              name="name"
              value={form.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Cadastral Zone ID</label>
            <input
              type="number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter cadastral zone ID"
              name="cadastral_zone_id"
              value={form.cadastral_zone_id}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
              onClick={submitForm}
            >
              Add Street
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewStreetModal;
