import React, { useState } from 'react';
import { HiUsers, HiX } from 'react-icons/hi';
import { BiLoader } from "react-icons/bi";
import { Modal } from 'react-responsive-modal';
import apiCall from '../../../Api/apiCall';
import { CustomAlert } from "../../Index"; 
import { SiAmazonecs } from "react-icons/si";

export const CadastralZoneModal = ({ ratingDistricts }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitForm = async () => {
    try {
      setIsLoading(true);
      const response = await apiCall({
        endpoint: "cadastral-zone/create",
        method: "post",
        data: form,
      });

      if (response.status === 201) {
        setSnackbar({
          open: true,
          message: "Cadastral Zone created Successfully",
          severity: "success",
        });
        setForm({});
        setOpen(false);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "An error occurred while creating cadastral zone data",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div>
      <div className="flex items-center justify-end mb-4 gap-2">
        <button
          type="button"
          className="flex items-center justify-between p-2 space-x-1 border rounded button-gradient-one border-custom-color-two shadow-custom-100"
          style={{ width: "8%" }}
          onClick={onOpenModal}
        >
          <span className="text-sm text-white">
            <SiAmazonecs />
          </span>
          <span className="font-medium text-left text-white ellipsis font-lexend" style={{ fontSize: "0.6875rem" }}>
            New Cadastral Zone
          </span>
        </button>
      </div>
      <Modal open={open} onClose={onCloseModal} center>
        <div className="relative bg-white rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4 sticky top-0 z-10 p-6 bg-white">
            <h2 className="font-lexend text-gray-700 text-[15px]">Add New Cadastral Zone</h2>
            <button onClick={onCloseModal}>
              <HiX className="text-xl" />
            </button>
          </div>
          <form className="max-w-xl min-w-[30rem] p-6">
            <div className="mb-4">
              <label className="font-lexend text-gray-700 text-[15px]">Cadastral Zone Name</label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter Cadastral Zone Name"
                name="name"
                value={form.name || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="font-lexend text-gray-700 text-[15px]">Select Rating District</label>
              <select
                name="rating_district_id"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={form.rating_district_id || ''}
                onChange={handleInputChange}
              >
                <option className='text-xl font-semibold text-gray-700' value="" disabled>Select</option>
                {ratingDistricts.map((district) => (
                  <option className="font-lexend text-gray-700 text-[15px]" key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 flex items-center justify-center"
                style={{ width: "8%" }}
                onClick={submitForm}
                disabled={isLoading}
              >
                <span className="text-sm text-white">
                  {isLoading ? (
                    <BiLoader className="animate-spin" />
                  ) : (
                    <SiAmazonecs />
                  )}
                </span>
                <span className="font-medium text-left text-white ellipsis font-lexend" style={{ fontSize: "0.6875rem" }}>
                  Add New Cadastral Zone
                </span>
              </button>
            </div>
          </form>
        </div>
      </Modal>
      <CustomAlert
        isOpen={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        handleClose={handleSnackbarClose}
      />
    </div>
  );
};
