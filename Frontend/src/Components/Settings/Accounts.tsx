import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { BiSolidEditAlt } from "react-icons/bi";
import { GiJusticeStar } from "react-icons/gi";
import { IoPersonCircle } from "react-icons/io5";
import { MdCancel, MdLocationPin } from "react-icons/md";
import { InputComponent, SelectComponent, CustomAlert } from "../Index";
import { userData } from "../../Data/userData";
import axios from "axios";
import { useTokens } from "../../Utils/client";
import { useMediaQuery } from "react-responsive";

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
  navButtons: React.ReactNode;
};

const apiUrl = import.meta.env.VITE_API_URL as string;

export default function Accounts({
  currentUserData,
  navButtons,
}: AccountsProps) {
  const isMiniPhone = useMediaQuery({ query: "(min-width: 375px)" });
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
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
  const { token, userId, userRoleId } = useTokens();
  const { staticInformation } = userData();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

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
    setSnackbar({
      open: true,
      message: "Cancel changes without saving?",
      severity: "warning",
    });
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

      setIsLoading(true);

      try {
        const response = await axios.put(
          `${apiUrl}/api/staff/${userId}`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setSnackbar({
            open: true,
            message: "Updated Account Successfully",
            severity: "success",
          });
        } else {
          setSnackbar({
            open: true,
            message: "Unexpected status code",
            severity: "warning",
          });
        }
        setIsLoading(false);
      } catch (error: any) {
        let message = "Internal Server Error";
        if (error.response) {
          switch (error.response.status) {
            case 400:
              message = "Bad request.";
              break;
            case 401:
              message = "You are unauthorized";
              break;
            case 403:
              message = "You are forbidden";
              break;
            case 404:
              message = "Demand notice not found";
              break;
            default:
              break;
          }
        }
        setSnackbar({ open: true, message, severity: "error" });
      }
      setIsLoading(false);
      setDisplaySave(false);
      setEditStaff(false);
    } else {
      return;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {isDesktop ? null : navButtons}
      <form
        onSubmit={handleFormSubmit}
        className={`relative flex-col items-center justify-center ${
          isMiniPhone ? "min-w-[320px]" : "min-w-[290px]"
        } sm:min-w-[350px] md:min-w-[500px] lg:w-8/12 bg-white rounded`}
      >
        <img
          src={"/lightCheckeredBackgroundPattern.png"}
          alt="Checkered Background"
          className="absolute top-0 left-0 z-0 w-1/2"
        />
        <div className="absolute z-10 flex-col w-full p-2 sm:p-4 space-y-3 border-0.6 border-custom-color-one rounded">
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
                    onClick={() => {
                      if (userRoleId === 1 || 2) {
                        setEditStaff((prevState) => !prevState);
                      } else {
                        setSnackbar({
                          open: true,
                          message: "You don't have permission",
                          severity: "error",
                        });
                        return;
                      }
                    }}
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
                  className="flex items-center justify-between gap-4 sm:gap-0 font-lexend"
                >
                  <p className="px-1 py-0.5 text-darkblueberry rounded bg-lightblue text-xs">
                    {item.label}
                  </p>
                  <div className="flex w-[60%] sm:w-auto justify-end">
                    <InputComponent
                      inputContainer={"flex w-full justify-end"}
                      inputId={index}
                      inputType={item.type}
                      inputName={item.name}
                      inputValue={item.value}
                      handleInputChange={handleInputChange}
                      placeholder={`Enter your ${item.label}`}
                      required={true}
                      inputStyle={`flex items-center justify-end text-xs font-medium text-darkerblueberry outline-none ${
                        editStaff
                          ? "px-1 sm:px-2 py-1 text-left border-0.6 border-custom-color-one rounded"
                          : "border-none"
                      } ${isMiniPhone ? "text-right" : "text-left"}`}
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
        <CustomAlert
          isOpen={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          handleClose={handleSnackbarClose}
        />
      </form>
    </div>
  );
}
