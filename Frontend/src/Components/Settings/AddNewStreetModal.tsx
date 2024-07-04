import React, { useState, useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import apiCall from '../../Api/apiCall';

interface AddNewModalProps {
  isOpen: boolean;
  hideModal: () => void;
  endpoints: string;
  formFields: { label: string, name: string, type: string }[];
  postEndpoint: string;
}

const AddNewModal: React.FC<AddNewModalProps> = ({ isOpen, hideModal, endpoints, formFields, postEndpoint }) => {
  if (!isOpen) return null;

  const [form, setForm] = useState<{ [key: string]: string }>({});

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitForm = async () => {
    try {
      // Ensure all fields are filled
      for (const field of formFields) {
        if (!form[field.name]) {
          alert("All fields are required.");
          return;
        }
      }

      const response = await apiCall({
        endpoint: postEndpoint,
        method: "post",
        data: form,
      });

      if (response.status === 201) {
        setForm({});
        hideModal();
      } 
    } catch (error) {
      console.error('Error adding:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New {endpoints}</h2>
          <button onClick={hideModal}>
            <HiX className="text-xl" />
          </button>
        </div>
        <form>
          {formFields.map((field) => (
            <div key={field.name} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">{field.label}</label>
              <input
                type={field.type}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={`Enter ${field.label.toLowerCase()}`}
                name={field.name}
                value={form[field.name] || ''}
                onChange={handleInputChange}
              />
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
              onClick={submitForm}
            >
              Add {endpoints}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewModal;
