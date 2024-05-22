import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { BiSolidEditAlt } from "react-icons/bi";
import { GiJusticeStar } from "react-icons/gi";
import { IoPersonCircle } from "react-icons/io5";
import { MdCancel, MdLocationPin } from "react-icons/md";
import { InputComponent, SelectComponent } from "../Index";
import { staticInformation } from "../../Data/appData"

type CurrentUserData = {
  staffId: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phoneNumber: string;
  designation: string;
  staffZone: string;
};

type AccountsProps = {
  currentUserData: CurrentUserData;
};

export default function Accounts({ currentUserData }: AccountsProps) {
  const [editStaff, setEditStaff] = useState<boolean>(false);
  const [displaySave, setDisplaySave] = useState<boolean>(false);
  const [formData, setFormData] = useState<CurrentUserData>({
    staffId: currentUserData.staffId,
    firstName: currentUserData.firstName,
    lastName: currentUserData.lastName,
    middleName: currentUserData.middleName,
    email: currentUserData.email,
    phoneNumber: currentUserData.phoneNumber,
    designation: currentUserData.designation,
    staffZone: currentUserData.staffZone,
  });

  useEffect(() => {
    setFormData({
      staffId: currentUserData.staffId,
      firstName: currentUserData.firstName,
      lastName: currentUserData.lastName,
      middleName: currentUserData.middleName,
      email: currentUserData.email,
      phoneNumber: currentUserData.phoneNumber,
      designation: currentUserData.designation,
      staffZone: currentUserData.staffZone,
    });
  }, [editStaff, currentUserData]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Check if any form data has changed
    if (currentUserData[name as keyof CurrentUserData] !== value) {
      setDisplaySave(true);
    } else {
      setDisplaySave(false);
    }
  };

  const handleCancelEdit = () => {
    alert("Cancel changes without saving?");
    setFormData({
      staffId: currentUserData.staffId,
      firstName: currentUserData.firstName,
      lastName: currentUserData.lastName,
      middleName: currentUserData.middleName,
      email: currentUserData.email,
      phoneNumber: currentUserData.phoneNumber,
      designation: currentUserData.designation,
      staffZone: currentUserData.staffZone,
    });
    setEditStaff(false);
    setDisplaySave(false);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (displaySave) {
      console.log("FORM DATA:", formData);
      setDisplaySave(false);
      setEditStaff(false);
    } else {
      return;
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="relative flex-col items-center justify-center w-8/12 bg-white rounded"
    >
      <img
        src={"/lightCheckeredBackgroundPattern.png"}
        alt="Checkered Background"
        className="absolute top-0 left-0 z-0 w-1/2"
      />
      <div className="absolute z-10 flex-col w-full p-4 space-y-3 border-0.6 border-custom-color-one rounded">
        <div
          className="flex items-start justify-between"
          style={{ height: "7vh" }}
        >
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-color-text-two">
              STAFF ID
            </h3>
            <p className="text-base font-bold text-color-text-one">
              {currentUserData.staffId}
            </p>
          </div>
          {currentUserData.designation === "Admin" ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium font-lexend hover:cursor-pointer">
                {editStaff ? (
                  <div className="flex items-center justify-center gap-2">
                    <span
                      className="flex items-center justify-center text-color-dark-red gap-1 border rounded border-color-dark-red h-[24px] px-1"
                      title="Cancel Changes"
                      onClick={() => handleCancelEdit()}
                    >
                      <MdCancel />
                      Cancel Changes
                    </span>
                    {displaySave ? (
                      <button
                        type="submit"
                        className="flex items-center justify-center bg-primary-color text-white h-[24px] px-2 rounded"
                        title="Save Staff Details"
                        disabled={!displaySave}
                      >
                        Save
                      </button>
                    ) : null}
                  </div>
                ) : (
                  <span
                    className="flex items-center justify-center text-primary-color border border-primary-color rounded w-[24px] h-[24px] px-0.5"
                    title="Edit Staff"
                    onClick={() => setEditStaff((prevState) => !prevState)}
                  >
                    <BiSolidEditAlt />
                  </span>
                )}
              </span>
            </div>
          ) : null}
        </div>
        <div className="flex-col space-y-6">
          <div className="flex-col p-2 space-y-2 border rounded border-custom-color-two">
            <div className="flex items-center gap-1.5 text-xs text-custom-blue-300 font-lexend">
              <span className="text-lg">
                <IoPersonCircle />
              </span>
              DETAILS
            </div>
            {[
              {
                label: "Staff ID",
                name: "staffId",
                type: "text",
                value: formData.staffId,
              },
              {
                label: "First Name",
                name: "firstName",
                type: "text",
                value: formData.firstName,
              },
              {
                label: "Last Name",
                name: "lastName",
                type: "text",
                value: formData.lastName,
              },
              {
                label: "Middle Name",
                name: "middleName",
                type: "text",
                value: formData.middleName,
              },
              {
                label: "Email",
                name: "email",
                type: "email",
                value: formData.email,
              },
              {
                label: "Phone Number",
                name: "phoneNumber",
                type: "tel",
                value: formData.phoneNumber,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between font-lexend"
              >
                <p className="px-1 py-0.5 text-darkblueberry rounded bg-lightblue text-xs">
                  {item.label}
                </p>
                <p className="flex w-[50%] justify-end">
                  <InputComponent
                    inputContainer={""}
                    inputId={index}
                    inputType={item.type}
                    inputName={item.name}
                    inputValue={item.value}
                    handleInputChange={handleInputChange}
                    placeholder={`Enter your ${item.label}`}
                    required={true}
                    inputStyle={`flex items-center justify-end text-xs font-medium text-darkerblueberry outline-none ${
                      editStaff
                        ? "px-2 py-1 text-left border-0.6 border-custom-color-one rounded"
                        : "border-none text-right"
                    } `}
                    readOnly={!editStaff}
                    iconStyle=""
                  />
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between p-2 space-y-2 border-0.6 rounded bg-white border-custom-color-one font-lexend">
          <div className="flex items-center gap-1.5 text-primary-color">
            <GiJusticeStar />
            <p className="text-xs text-darkerblueberry">Designation</p>
          </div>
          {editStaff ? (
            <SelectComponent
              selectContainer=""
              selectId="designation"
              selectName="designation"
              selectValue={formData.designation}
              handleSelectChange={handleInputChange}
              options={["Manager", "Officer", "Admin", "Enforcer"]}
              selectStyle={
                "flex items-center justify-end text-xs font-medium text-darkerblueberry outline-none px-2 py-1 text-left border-0.6 border-custom-color-one rounded"
              }
              readOnly={!editStaff}
            />
          ) : (
            <span className={`px-1 py-0.5 rounded-xl text-[10px] font-light text-darkerblueberry border-[0.4px] border-divider-grey
                ${
                  currentUserData.designation === "Manager"
                    ? "bg-color-light-red"
                    : currentUserData.designation === "Officer"
                    ? "bg-color-light-yellow"
                    : currentUserData.designation === "Admin"
                    ? "bg-color-bright-green text-white"
                    : "bg-primary-color text-white"
                }
                `}
            >
              {currentUserData.designation.toUpperCase()}
            </span>
         
          )}
        </div>
        <div className="flex items-center justify-between p-2 space-y-2 border-0.6 rounded bg-white border-custom-color-one font-lexend">
          <div className="flex items-center gap-1.5 text-primary-color">
            <MdLocationPin />
            <p className="text-xs text-darkerblueberry">Zone</p>
          </div>
          {editStaff ? (
            <SelectComponent
              selectContainer=""
              selectId="staffZone"
              selectName="staffZone"
              selectValue={formData.staffZone}
              handleSelectChange={handleInputChange}
              options={staticInformation.cadestralZones}
              selectStyle={
                "flex items-center justify-end text-xs font-medium text-darkerblueberry outline-none px-2 py-1 text-left border-0.6 border-custom-color-one rounded"
              }
              readOnly={!editStaff}
            />
          ) : (
            <span className="px-2 py-0.5 rounded text-xs bg-custom-grey-100 text-darkerblueberry">
              {currentUserData.staffZone.toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </form>
  );
}