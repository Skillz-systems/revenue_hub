import React, { useState, ChangeEvent, FormEvent } from "react";
import { GrFormViewHide, GrFormView } from "react-icons/gr";
import { InputComponent } from "../Index";

type FormData = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function Password() {
  const [passwordDisplay, setPasswordDisplay] = useState<boolean>(false);
  const [confirmPasswordDisplay, setConfirmPasswordDisplay] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    } else {
      return;
    }
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
            Click any field below to make changes
          </p>
        </div>
        <InputComponent
          inputContainer={
            "flex items-center justify-between border border-custom-color-one rounded"
          }
          inputType={"text"}
          inputName={"oldPassword"}
          inputValue={formData.oldPassword}
          handleInputChange={handleInputChange}
          placeholder={"OLD PASSWORD"}
          required={true}
          inputStyle={
            "text-color-text-two h-[48px] bg-white rounded outline-none px-4 py-2 w-full font-lexend text-xs"
          }
        />
        <InputComponent
          inputContainer={
            "flex items-center justify-between border border-custom-color-one rounded"
          }
          inputType={passwordDisplay ? "text" : "password"}
          inputName={"newPassword"}
          inputValue={formData.newPassword}
          handleInputChange={handleInputChange}
          placeholder={"ENTER NEW PASSWORD"}
          required={true}
          inputStyle={
            "text-color-text-two h-[48px] bg-white rounded-l outline-none px-4 py-2 w-full font-lexend text-xs"
          }
          iconStyle={
            "flex items-center justify-center text-color-text-two bg-white pr-[4%] h-[48px] text-[20px] rounded-r"
          }
          onIconClick={() => setPasswordDisplay(!passwordDisplay)}
          inputIcon={passwordDisplay ? <GrFormView /> : <GrFormViewHide />}
        />
        <InputComponent
          inputContainer={
            "flex items-center justify-between border border-custom-color-one rounded"
          }
          inputType={confirmPasswordDisplay ? "text" : "password"}
          inputName={"confirmPassword"}
          inputValue={formData.confirmPassword}
          handleInputChange={handleInputChange}
          placeholder={"CONFIRM NEW PASSWORD"}
          required={true}
          inputStyle={
            "text-color-text-two h-[48px] bg-white rounded-l outline-none px-4 py-2 w-full font-lexend text-xs"
          }
          iconStyle={
            "flex items-center justify-center text-color-text-two bg-white pr-[4%] h-[48px] text-[20px] rounded-r"
          }
          onIconClick={() => setConfirmPasswordDisplay(!confirmPasswordDisplay)}
          inputIcon={
            confirmPasswordDisplay ? <GrFormView /> : <GrFormViewHide />
          }
        />
        <InputComponent
          inputContainer={
            "flex items-center justify-between gap-1 bg-primary-color rounded"
          }
          inputType={"submit"}
          inputValue={"Change Password"}
          inputStyle={
            "h-[48px] rounded outline-none px-2 py-1 w-full font-lexend text-base font-medium text-white hover:cursor-pointer"
          }
        />
      </form>
    </div>
  );
}
