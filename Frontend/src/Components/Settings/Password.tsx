import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { GrFormViewHide, GrFormView } from "react-icons/gr";
import { InputComponent, CustomAlert } from "../Index";
import axios from "axios";
import { useTriggerError } from "../../Utils/client";

export default function Password({ userEmail }) {
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>("");
  const triggerError = useTriggerError();

  useEffect(() => {
    if (userEmail) {
      setForgotPasswordEmail(userEmail);
    }
  }, [userEmail]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
        setSnackbar({
          open: true,
          message: "Password reset link has been sent to your email",
          severity: "success",
        });
      } else {
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
            message = "Bad request.";
            break;
          default:
            const errorData = {
              status: error?.response?.status,
              message: error?.response?.statusText,
            };
            triggerError(errorData);
            break;
        }
      }
      setSnackbar({ open: true, message, severity: "error" });
    }
    setIsLoading(false);
  };

  return (
    <div className="relative flex-col items-center justify-center w-8/12 bg-white rounded">
      <img
        src={"/lightCheckeredBackgroundPattern.png"}
        alt="Checkered Background"
        className="absolute top-0 left-0 z-0 w-1/2"
      />
      <form
        onSubmit={handleFormSubmit}
        autoComplete="off"
        className="absolute z-10 flex-col w-full p-4 space-y-3 border-0.6 border-custom-color-one rounded"
      >
        <div
          className="flex items-start justify-between"
          style={{ height: "10vh" }}
        >
          <h3 className="text-base font-bold text-color-text-two">
            CHANGE PASSWORD
          </h3>
        </div>
        <div className="flex items-center">
          <p className="px-2 py-1 rounded text-xs text-color-text-two font-lexend border-0.6 border-custom-color-one">
            Click change password below to receive email instructions
          </p>
        </div>
        <InputComponent
          inputContainer={
            "flex items-center justify-between border border-custom-color-one rounded"
          }
          inputType={"text"}
          inputName={"forgotPasswordEmail"}
          inputValue={forgotPasswordEmail}
          placeholder={"Email"}
          required={true}
          inputStyle={
            "text-color-text-two h-[48px] bg-white rounded outline-none px-4 py-2 w-full font-lexend text-xs pointer-events-none"
          }
          readOnly={true}
        />
        <InputComponent
          inputContainer={
            "flex items-center justify-between gap-1 bg-primary-color rounded"
          }
          inputType={"submit"}
          inputValue={`${isLoading ? "Sending Email..." : "Change Password"}`}
          inputStyle={
            "h-[48px] rounded outline-none px-2 py-1 w-full font-lexend text-base font-medium text-white hover:cursor-pointer"
          }
        />
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
