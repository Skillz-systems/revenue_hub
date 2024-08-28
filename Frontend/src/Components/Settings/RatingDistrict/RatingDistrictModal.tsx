import React, { useState } from 'react';
import { HiX, HiUsers } from 'react-icons/hi';
import { BiLoader } from "react-icons/bi";
import { Modal } from 'react-responsive-modal';
import apiCall from '../../../Api/apiCall';
import { CustomAlert } from "../../Index"; 
import { GiVibratingBall } from "react-icons/gi";

export const RatingDistrictModal = ({ officeZones }) => {
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
        endpoint: "rating-district/create",
        method: "post",
        data: form,
      });

      if (response.status === 201) {
        setSnackbar({
          open: true,
          message: "Rating District created successfully!",
          severity: "success",
        });
        setForm({});
        onCloseModal();
      }
    } catch (error) {
      console.error('Error adding:', error);
      setSnackbar({
        open: true,
        message: "Error creating Rating District",
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
            <GiVibratingBall />
          </span>
          <span className="font-medium text-left text-white ellipsis font-lexend" style={{ fontSize: "0.6875rem" }}>
            New Rating District
          </span>
        </button>
      </div>
      <Modal open={open} onClose={onCloseModal} center>
        <div className="relative bg-white rounded-lg shadow-lg ">
          <div className="flex justify-between items-center mb-4 sticky top-0 z-10 p-6 bg-white">
            <h2 className="font-lexend text-gray-700 text-[15px]">Add New Rating District</h2>
            <button onClick={onCloseModal}>
              <HiX className="text-xl" />
            </button>
          </div>
          <form className="max-w-xl min-w-[30rem] p-6">
            <div className="mb-4">
              <label className="font-lexend text-gray-700 text-[15px]">Rating District Name</label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter Rating District Name"
                name="name"
                value={form.name || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="font-lexend text-gray-700 text-[15px]">Select Office Zone</label>
              <select
                name="office_zone_id"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={form.office_zone_id || ''}
                onChange={handleInputChange}
              >
                <option className='text-xl font-semibold text-gray-700' value="" disabled>Select</option>
                {officeZones.map((zone) => (
                  <option className="font-lexend text-gray-700 text-[15px]" key={zone.id} value={zone.id}>{zone.name}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-blue-800 text-white rounded-md shadow-sm hover:bg-blue-700 flex items-center justify-center"
                style={{ width: "8%" }}
                onClick={submitForm}
                disabled={isLoading}
              >
                <span className="text-sm text-white">
                  {isLoading ? (
                    <BiLoader className="animate-spin" />
                  ) : (
                    <GiVibratingBall />
                  )}
                </span>
                <span className="font-medium text-left text-white ellipsis font-lexend" style={{ fontSize: "0.6875rem" }}>
                  Add New Rating District
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
