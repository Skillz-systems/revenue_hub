import React, { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import images from "../assets";
import { InputComponent, CustomAlert } from "../Components/Index";
import { GrFormViewHide, GrFormView } from "react-icons/gr";
import axios from "axios";
import Cookies from "js-cookie";

function LoginPage(): JSX.Element {
  const [passwordDisplay, setPasswordDisplay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [forgotPasswordState, setForgotPasswordState] = useState<string | null>(
    null
  );
  const [forgotErrorState, setForgotErrorState] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>("");
  const [resetSucess, setResetSuccess] = useState<string>("");
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleForgotPasswordEmailChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setForgotPasswordEmail(event.target.value);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData) {
      return setSnackbar({
        open: true,
        message: "Please fill in all required fields",
        severity: "warning",
      });
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://api.revenuehub.skillzserver.com/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.status === 200) {
        Cookies.set("userData", JSON.stringify(response.data.data), {
          expires: 7,
        }); // Token expires in 7 days
        navigate("/dashboard");
      } else {
        setErrorState(response.data.message);
      }
    } catch (error) {
      if (error.response.status === 400) {
        setErrorState(
          "Ensure that all required filed are properly filled. Your password is at least 8 characters."
        );
      } else if (error.response.status === 401) {
        setErrorState("Invalid email or password. Please try again.");
      } else {
        setErrorState("Internal Server Error. Please report the issue");
        console.error(error);
      }
    }
    setIsLoading(false);
  };

  const handleForgotPasswordSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!forgotPasswordEmail) {
      return setSnackbar({
        open: true,
        message: "Please enter your email",
        severity: "warning",
      });
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://api.revenuehub.skillzserver.com/api/auth/forgot-password",
        {
          email: forgotPasswordEmail,
        }
      );

      if (response.status === 200) {
        setResetSuccess("Password reset link has been sent to your email");
      } else {
        setForgotErrorState(response.data.message);
        setResetSuccess("");
      }
    } catch (error) {
      setForgotErrorState("The staff email doesn't exist");
      setResetSuccess("");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen px-4 py-5 overflow-y-auto md:pt-8 md:p-12 lg:pt-12 lg:flex-row lg:p-16 bg-gradient-to-r from-blue-300 via-purple-200 to-red-100 overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white">
      <div className="hidden items-center justify-center lg:flex lg:w-[60%] w-full">
        <img src={images.Key} alt="Padlock" className="w-48 lg:w-[300px]" />
      </div>
      <div className="flex flex-col px-7 py-12 lg:py-5 lg:px-16 items-center space-y-2 md:space-y-3 justify-center w-full lg:w-[40%] rounded-xl md:rounded-md bg-white bg-opacity-20 shadow-2xl lg:mt-8">
        <div className="flex items-center justify-center w-full pt-2 md:hidden">
          <img src={images.logo} alt="Logo" className="w-40 md:w-[100px]" />
        </div>
        <div className="flex flex-col w-full gap-2 text-center lg:text-left">
          <span className="text-color-text-one font-bold text-2xl md:text-[24px] leading-6">
            Welcome Back
          </span>
          <span className="font-bold text-sm lg:text-[14px] text-color-text-two">
            {forgotPasswordState === "email"
              ? "STAFF FORGOT PASSWORD"
              : "STAFF SIGN IN"}
          </span>
        </div>
        <form
          className="flex flex-col w-full space-y-4 md:space-y-3"
          onSubmit={handleFormSubmit}
        >
          {forgotPasswordState === "email" ? null : (
            <>
              <InputComponent
                inputContainer="flex items-center justify-between gap-1 bg-white rounded border border-custom-color-one"
                inputType="email"
                inputName="email"
                inputValue={formData.email}
                handleInputChange={handleInputChange}
                placeholder="Enter email here"
                required={true}
                inputStyle="text-color-text-two h-12 md:h-[48px] bg-white rounded outline-none px-3 py-2 md:px-4 md:py-2 w-full font-lexend text-xs"
              />
              <InputComponent
                inputContainer="flex items-center justify-between border border-custom-color-one rounded"
                inputType={passwordDisplay ? "text" : "password"}
                inputName="password"
                inputValue={formData.password}
                handleInputChange={handleInputChange}
                placeholder="Enter password here"
                required={true}
                inputStyle="text-color-text-two h-12 md:h-[48px] bg-white rounded-l outline-none px-3 py-2  md:px-4 md:py-2 w-full font-lexend text-xs"
                iconStyle="flex items-center justify-center text-color-text-two bg-white pr-3 md:pr-[4%] h-12 md:h-[48px] text-lg lg:text-[20px] rounded-r"
                onIconClick={() => setPasswordDisplay(!passwordDisplay)}
                inputIcon={
                  passwordDisplay ? <GrFormView /> : <GrFormViewHide />
                }
              />
              <InputComponent
                inputContainer="flex items-center justify-between gap-1 bg-primary-color rounded"
                inputType="submit"
                inputValue={isLoading ? "Submitting..." : "Login"}
                inputStyle="h-12 mg:h-[48px] rounded outline-none px-1 py-0.5 md:px-2 md:py-1 w-full font-lexend text-sm md:text-base font-medium text-white hover:cursor-pointer"
              />
            </>
          )}
          <p className="text-xs font-lexend text-color-dark-red">
            {errorState}
          </p>
          {forgotPasswordState === "email" ? null : (
            <p
              className="flex items-center justify-center text-sm underline cursor-pointer text-color-text-two font-lexend"
              onClick={() => setForgotPasswordState("email")}
            >
              Forgot Password?
            </p>
          )}
        </form>
        <form
          onSubmit={handleForgotPasswordSubmit}
          className="flex flex-col w-full space-y-4 md:space-y-3"
        >
          {forgotPasswordState === "email" ? (
            <>
              <InputComponent
                inputContainer="flex items-center justify-between gap-1 bg-white rounded border border-custom-color-one"
                inputType="email"
                inputName="forgotPasswordEmail"
                inputValue={forgotPasswordEmail}
                handleInputChange={handleForgotPasswordEmailChange}
                placeholder="Enter email here"
                required={true}
                inputStyle="text-color-text-two h-12 md:h-[48px] bg-white rounded outline-none px-3 py-2 md:px-4 md:py-2 w-full font-lexend text-xs"
              />
              <InputComponent
                inputContainer="flex items-center justify-between gap-1 bg-primary-color rounded"
                inputType="submit"
                inputValue={isLoading ? "Submitting..." : "Submit"}
                inputStyle="h-12 mg:h-[48px] rounded outline-none px-1 py-0.5 md:px-2 md:py-1 w-full font-lexend text-sm md:text-base font-medium text-white hover:cursor-pointer"
              />
              <p
                className={`text-xs font-lexend ${
                  resetSucess != ""
                    ? "text-color-bright-green"
                    : "text-color-dark-red"
                }`}
              >
                {resetSucess ? resetSucess : null}
                {forgotErrorState}
              </p>
              {forgotPasswordState === "email" ? (
                <p
                  className="flex items-center justify-center text-sm underline cursor-pointer text-color-text-two font-lexend"
                  onClick={() => setForgotPasswordState("login")}
                >
                  Back to login
                </p>
              ) : null}
            </>
          ) : null}
        </form>
        <div className="items-center justify-center hidden w-full md:flex">
          <img src={images.logo} alt="Logo" className="w-32 md:w-[100px]" />
        </div>
      </div>
      <CustomAlert
        isOpen={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        handleClose={handleSnackbarClose}
      />
    </div>
  );
}

export default LoginPage;
