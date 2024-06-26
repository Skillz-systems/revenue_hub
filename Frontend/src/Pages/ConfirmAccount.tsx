import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import images from "../assets";
import { InputComponent, CustomAlert } from "../Components/Index";
import axios from "axios";
import { useTriggerError } from "../Utils/client";

const apiUrl = import.meta.env.VITE_API_URL as string;

function ConfirmAccount(): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [staff, setStaff] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phoneNumber: "",
  });
  const navigate = useNavigate();
  const { id: userId, token: remember_token } = useParams();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const triggerError = useTriggerError();

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchUserData = async () => {
    try {
      setSnackbar({
        open: true,
        message: "Fetching staff details",
        severity: "info",
      });
      const response = await axios.post(
        `${apiUrl}/api/user-with-token/${userId}`,
        {
          token: remember_token,
        }
      );
      if (response.status === 200) {
        setStaff(response.data);
        setSnackbar({
          open: true,
          message: "Successfully retrieved staff data",
          severity: "success",
        });
      } else {
        setErrorState(response.data.message);
        setSnackbar({
          open: true,
          message: "Unexpected status code",
          severity: "warning",
        });
      }
    } catch (error: any) {
      let message = "Internal Server Error";
      if (error.response) {
        switch (error.response.status) {
          case 403:
            message = "You are forbidden!";
            break;
          case 404:
            message = "No Staff Found";
            break;
          case 429:
            message = "Too many requests made. Refreshing in 3 seconds";
            setTimeout(() => {
              window.location.reload();
            }, 3000);
            break;
          case 500:
            triggerError(error);
            break;
          default:
            break;
        }
      }
      setSnackbar({ open: true, message, severity: "error" });
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrorState(null);
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.firstName || !formData.email || !formData.phoneNumber) {
      return setSnackbar({
        open: true,
        message: "Please fill in all required fields",
        severity: "warning",
      });
    }

    setIsLoading(true);
    setErrorState(null); // Clear any previous error messages

    try {
      const response = await axios.put(
        `${apiUrl}/api/staff/update-staff-details/${userId}`,
        {
          name: formData.firstName,
          email: formData.email,
          phone: formData.phoneNumber,
          remember_token: remember_token,
        }
      );

      if (response.status === 200 || 201) {
        navigate(`/create-password/${userId}/${remember_token}`);
      } else {
        setErrorState(response.data.message);
        setSnackbar({
          open: true,
          message: "Unexpected status code",
          severity: "warning",
        });
      }
    } catch (error: any) {
      let message = "Internal Server Error";
      if (error.response) {
        switch (error.response.status) {
          case 400:
            message = "Bad request. All Fields are required!";
            break;
          case 401:
            message = "You are unauthorized";
            break;
          case 429:
            message = "Too many requests made. Refreshing in 3 seconds";
            setTimeout(() => {
              window.location.reload();
            }, 3000);
            break;
          case 500:
            triggerError(error);
            break;
          default:
            break;
        }
      }
      setSnackbar({ open: true, message, severity: "error" });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (staff) {
      setFormData({
        firstName: staff.data.name || "",
        email: staff.data.email || "",
        phoneNumber: staff.data.phone || "",
      });
    }
  }, [staff]);

  useEffect(() => {
    if (userId || remember_token) {
      fetchUserData();
    }
  }, [userId, remember_token]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen px-4 py-5 overflow-y-auto md:pt-8 md:p-12 lg:pt-12 lg:flex-row lg:p-16 bg-gradient-to-r from-blue-300 via-purple-200 to-red-100 overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white">
      <div className="hidden items-center justify-center lg:flex lg:w-[60%] w-full">
        <img src={images.Key} alt="Padlock" className="w-48 lg:w-[300px]" />
      </div>
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col px-7 py-12 lg:py-5 lg:px-16 items-center space-y-10 md:space-y-8 justify-center w-full lg:w-[40%] rounded-xl md:rounded-md bg-white bg-opacity-20 shadow-2xl lg:mt-8"
      >
        <div className="flex items-center justify-center w-full pt-2 md:hidden">
          <img src={images.logo} alt="Logo" className="w-40 md:w-[100px]" />
        </div>
        <div className="flex flex-col w-full gap-2 text-center lg:text-left">
          <span className="text-color-text-one font-bold text-2xl md:text-[24px] leading-6">
            Welcome Back
          </span>
          <span className="font-bold text-sm lg:text-[14px] text-color-text-two uppercase">
            Please provide your details to continue
          </span>
        </div>
        <div className="flex flex-col w-full space-y-4 md:space-y-3">
          <InputComponent
            inputContainer="flex items-center justify-between border border-custom-color-one rounded"
            inputType="text"
            inputName="firstName"
            inputValue={formData.firstName}
            handleInputChange={handleInputChange}
            placeholder="First Name"
            required={true}
            inputStyle="text-color-text-two h-12 md:h-[48px] bg-white rounded-l outline-none px-3 py-2  md:px-4 md:py-2 w-full font-lexend text-xs"
          />
          <InputComponent
            inputContainer="flex items-center justify-between border border-custom-color-one rounded"
            inputType="email"
            inputName="email"
            inputValue={formData.email}
            handleInputChange={handleInputChange}
            placeholder="Email"
            required={true}
            inputStyle="text-color-text-two h-12 md:h-[48px] bg-white rounded-l outline-none px-3 py-2  md:px-4 md:py-2 w-full font-lexend text-xs"
          />
          <InputComponent
            inputContainer="flex items-center justify-between border border-custom-color-one rounded"
            inputType="text"
            inputName="phoneNumber"
            inputValue={formData.phoneNumber}
            handleInputChange={handleInputChange}
            placeholder="Phone Number"
            required={true}
            inputStyle="text-color-text-two h-12 md:h-[48px] bg-white rounded-l outline-none px-3 py-2  md:px-4 md:py-2 w-full font-lexend text-xs"
          />
          <InputComponent
            inputContainer="flex items-center justify-between gap-1 bg-primary-color rounded"
            inputType="submit"
            inputValue={isLoading ? "Submitting..." : "Submit"}
            inputStyle="h-12 mg:h-[48px] rounded outline-none px-1 py-0.5 md:px-2 md:py-1 w-full font-lexend text-sm md:text-base font-medium text-white hover:cursor-pointer"
          />
          <p className="text-xs font-lexend text-color-dark-red">
            {errorState}
          </p>
        </div>
        <div className="items-center justify-center hidden w-full pt-2 md:flex">
          <img src={images.logo} alt="Logo" className="w-32 md:w-[100px]" />
        </div>
      </form>
      <CustomAlert
        isOpen={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        handleClose={handleSnackbarClose}
      />
    </div>
  );
}

export default ConfirmAccount;
