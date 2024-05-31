import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { BiSolidEditAlt } from "react-icons/bi";
import { GiJusticeStar } from "react-icons/gi";
import { IoPersonCircle } from "react-icons/io5";
import { MdCancel, MdLocationPin } from "react-icons/md";
import { InputComponent, SelectComponent } from "../Index";
import { userData } from "../../Data/userData";
import axios from "axios";
import { useTokens } from "../../Utils/client";

type CurrentUserData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: {
    id: number;
    name: string;
  };
  zone: string;
};

type AccountsProps = {
  currentUserData: CurrentUserData;
};

export default function Accounts({ currentUserData }: AccountsProps) {
  const [editStaff, setEditStaff] = useState<boolean>(false);
  const [displaySave, setDisplaySave] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<CurrentUserData>({
    id: currentUserData.id,
    name: currentUserData.name,
    email: currentUserData.email,
    phone: currentUserData.phone,
    role: {
      id: currentUserData.role.id,
      name: currentUserData.role.name,
    },
    zone: currentUserData.zone,
  });
  const { token, userId } = useTokens();
  const { staticInformation } = userData();

  useEffect(() => {
    setFormData({
      id: currentUserData.id,
      name: currentUserData.name,
      email: currentUserData.email,
      phone: currentUserData.phone,
      role: {
        id: currentUserData.role.id,
        name: currentUserData.role.name,
      },
      zone: currentUserData.zone,
    });
  }, [editStaff, currentUserData]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
      id: currentUserData.id,
      name: currentUserData.name,
      email: currentUserData.email,
      phone: currentUserData.phone,
      role: {
        id: currentUserData.role.id,
        name: currentUserData.role.name,
      },
      zone: currentUserData.zone,
    });
    setEditStaff(false);
    setDisplaySave(false);
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (displaySave) {
      // Prepare the request data
      const requestData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role_id: formData.role.id.toString(),
        zone: formData.zone,
      };

      console.log("requestData", requestData);
      setIsLoading(true);

      try {
        const response = await axios.put(
          `https://api.revenuehub.skillzserver.com/api/staff/${userId}`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          console.log("Success:", response.data);
          alert("Form submitted successfully!");
        } else {
          console.error("Unexpected status code:", response.status);
          alert("Unexpected status code. Please try again.");
        }
        setIsLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized:", error.response.data);
          alert("Unauthorized. Please login again.");
        } else {
          console.error("Error submitting form:", error);
          alert("An error occurred while submitting the form.");
        }
      }
      setIsLoading(false);
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
              {currentUserData.id}
            </p>
          </div>
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
                      {isLoading ? "Submitting..." : "Save"}
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
                name: "id",
                type: "text",
                value: formData.id,
              },
              {
                label: "Full Name",
                name: "name",
                type: "text",
                value: formData.name,
              },
              {
                label: "Email",
                name: "email",
                type: "email",
                value: formData.email,
              },
              {
                label: "Phone Number",
                name: "phone",
                type: "tel",
                value: formData.phone,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between font-lexend"
              >
                <p className="px-1 py-0.5 text-darkblueberry rounded bg-lightblue text-xs">
                  {item.label}
                </p>
                <div className="flex w-[50%] justify-end">
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
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between p-2 space-y-2 border-0.6 rounded bg-white border-custom-color-one font-lexend">
          <div className="flex items-center gap-1.5 text-primary-color">
            <GiJusticeStar />
            <p className="text-xs text-darkerblueberry">Designation</p>
          </div>
          {editStaff &&
          (currentUserData.role.name === "Admin" ||
            currentUserData.role.id === 2) ? (
            <SelectComponent
              selectContainer=""
              selectId="role"
              selectName="role"
              selectValue={formData.role.name}
              handleSelectChange={handleInputChange}
              options={["Manager", "Admin", "Enforcer", "Officer"]}
              selectStyle={
                "flex items-center justify-end text-xs font-medium text-darkerblueberry outline-none px-2 py-1 text-left border-0.6 border-custom-color-one rounded"
              }
              readOnly={!editStaff}
            />
          ) : (
            <span
              className={`px-1 py-0.5 rounded-xl text-[10px] font-light text-darkerblueberry border-[0.4px] border-divider-grey
                ${
                  currentUserData.role.id === 1
                    ? "bg-color-light-red"
                    : currentUserData.role.id === 4
                    ? "bg-color-light-yellow"
                    : currentUserData.role.id === 2
                    ? "bg-color-bright-green text-white"
                    : "bg-primary-color text-white"
                }
                `}
            >
              {currentUserData.role.name.toUpperCase()}
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
              selectId="zone"
              selectName="zone"
              selectValue={formData.zone}
              handleSelectChange={handleInputChange}
              options={staticInformation.cadestralZones}
              selectStyle={
                "flex items-center justify-end text-xs font-medium text-darkerblueberry outline-none px-2 py-1 text-left border-0.6 border-custom-color-one rounded"
              }
              readOnly={!editStaff}
            />
          ) : (
            <span className="px-2 py-0.5 rounded text-xs bg-custom-grey-100 text-darkerblueberry">
              {currentUserData.zone.toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
