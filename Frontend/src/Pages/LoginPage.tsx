import React, { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import images from "../assets";
import { InputComponent } from "../Components/Index";
import { GrFormViewHide, GrFormView } from "react-icons/gr";

function LoginPage(): JSX.Element {
  const [passwordDisplay, setPasswordDisplay] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("FORM DATA:", formData);
    navigate("/");
  };

  return (
    <div className="flex w-full h-screen p-16 pt-12 overflow-y-auto bg-gradient-to-r from-blue-300 via-purple-200 to-red-100 overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white">
      <div className="flex items-center justify-center w-[60%]">
        <img src={images.Key} alt="Padlock" className="w-[300px]" />
      </div>
      <form
        onSubmit={handleFormSubmit}
        autoComplete="off"
        className="flex flex-col px-16 items-center space-y-8 justify-center w-[40%] rounded-md bg-white bg-opacity-20 shadow-2xl"
      >
        <div className="flex flex-col w-full gap-2">
          <span className="text-color-text-one font-bold text-[24px] leading-6">
            Welcome Back
          </span>
          <span className="font-bold text-[14px] text-color-text-two">
            STAFF SIGN IN
          </span>
        </div>
        <div className="flex-col w-full space-y-3 ">
          <InputComponent
            inputContainer={
              "flex items-center justify-between gap-1 bg-white rounded border border-custom-color-one "
            }
            inputType={"email"}
            inputName={"email"}
            inputValue={formData.email}
            handleInputChange={handleInputChange}
            placeholder={"Enter email here"}
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
            inputName={"password"}
            inputValue={formData.password}
            handleInputChange={handleInputChange}
            placeholder={"Enter password here"}
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
              "flex items-center justify-between gap-1 bg-primary-color rounded"
            }
            inputType={"submit"}
            inputValue={"Login"}
            inputStyle={
              "h-[48px] rounded outline-none px-2 py-1 w-full font-lexend text-base font-medium text-white hover:cursor-pointer"
            }
          />
          <p className="flex items-center justify-center text-xs underline text-color-text-two font-lexend">
            Forgot Password?
          </p>
        </div>
        <div className="flex items-center justify-center w-full pt-2">
          <img src={images.logo} alt="Padlock" className="w-[100px]" />
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
