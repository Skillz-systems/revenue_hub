import React, { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import images from "../assets";
import { InputComponent, CustomAlert } from "../Components/Index";
import { GrFormViewHide, GrFormView } from "react-icons/gr";
import axios from "axios";

function AccountPassword(): JSX.Element {
  const [passwordDisplay, setPasswordDisplay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const { id: userId, token: remember_token } = useParams();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
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

    if (!formData.password || !formData.confirmPassword) {
      return setSnackbar({
        open: true,
        message: "Please fill in all required fields",
        severity: "warning",
      });
    }
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrorState("Passwords do not match.");
      return;
    }

    // Validate password
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/;
    if (!passwordRegex.test(formData.password)) {
      const message =
        "Password must be at least 6 characters long and contain at least 1 number, 1 symbol, 1 uppercase letter, and 1 lowercase letter.";
      setErrorState(message);
      return;
    }

    setIsLoading(true);
    setErrorState(null); // Clear any previous error messages

    try {
      const response = await axios.post(
        "https://api.revenuehub.skillzserver.com/api/auth/store-password",
        {
          user: userId,
          token: remember_token,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
        }
      );

      if (response.status === 200 || 201) {
        navigate("/login");
      } else {
        setErrorState(response.data.message);
        setSnackbar({
          open: true,
          message: "Unexpected status code",
          severity: "warning",
        });
      }
    } catch (error) {
      let message = "Internal Server Error";
      if (error.response) {
        switch (error.response.status) {
          case 400:
            message = "Bad request. Fill in the required fields";
            break;
          case 401:
            message = "Invalid Password Token";
            break;
          default:
            break;
        }
      }
      setSnackbar({ open: true, message, severity: "error" });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen px-4 py-5 overflow-y-auto md:pt-8 md:p-12 lg:pt-12 lg:flex-row lg:p-16 bg-gradient-to-r from-blue-300 via-purple-200 to-red-100 overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white">
      <div className="hidden items-center justify-center lg:flex lg:w-[60%] w-full">
        <img src={images.Key} alt="Padlock" className="w-48 lg:w-[300px]" />
      </div>
      <form
        onSubmit={handleFormSubmit}
        // autoComplete="off"
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
            You need to create a password to access this portal
          </span>
        </div>
        <div className="flex flex-col w-full space-y-4 md:space-y-3">
          <InputComponent
            inputContainer="flex items-center justify-between border border-custom-color-one rounded"
            inputType={passwordDisplay ? "text" : "password"}
            inputName="password"
            inputValue={formData.password}
            handleInputChange={handleInputChange}
            placeholder="Enter New Password"
            required={true}
            inputStyle="text-color-text-two h-12 md:h-[48px] bg-white rounded-l outline-none px-3 py-2  md:px-4 md:py-2 w-full font-lexend text-xs"
            iconStyle="flex items-center justify-center text-color-text-two bg-white pr-3 md:pr-[4%] h-12 md:h-[48px] text-lg lg:text-[20px] rounded-r"
            onIconClick={() => setPasswordDisplay(!passwordDisplay)}
            inputIcon={passwordDisplay ? <GrFormView /> : <GrFormViewHide />}
          />
          <InputComponent
            inputContainer="flex items-center justify-between border border-custom-color-one rounded"
            inputType={passwordDisplay ? "text" : "password"}
            inputName="confirmPassword"
            inputValue={formData.confirmPassword}
            handleInputChange={handleInputChange}
            placeholder="Confirm New Password"
            required={true}
            inputStyle="text-color-text-two h-12 md:h-[48px] bg-white rounded-l outline-none px-3 py-2  md:px-4 md:py-2 w-full font-lexend text-xs"
            iconStyle="flex items-center justify-center text-color-text-two bg-white pr-3 md:pr-[4%] h-12 md:h-[48px] text-lg lg:text-[20px] rounded-r"
            onIconClick={() => setPasswordDisplay(!passwordDisplay)}
            inputIcon={passwordDisplay ? <GrFormView /> : <GrFormViewHide />}
          />
          <InputComponent
            inputContainer="flex items-center justify-between gap-1 bg-primary-color rounded"
            inputType="submit"
            inputValue={isLoading ? "Submitting..." : "Create Password"}
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

export default AccountPassword;
