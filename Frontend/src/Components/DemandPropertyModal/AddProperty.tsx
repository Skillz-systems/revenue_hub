import React, { useState, useEffect } from "react";
import { data } from "./inputFieldData";
import axios from "axios";
import Cookies from "js-cookie";
import { CustomAlert } from "../Index";

interface AddPropertyProps {
  hideAddPropertyModal: () => void;
  propertyModalTransition: boolean;
}

const AddProperty: React.FC<AddPropertyProps> = ({
  hideAddPropertyModal,
  propertyModalTransition,
}) => {
  const [activateState, setActiveState] = useState<number>(1);
  const [errorState, setErrorState] = useState<number | undefined>();
  const [errorField, setErrorField] = useState<string | undefined>(undefined);
  const [formData, setFormData] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check if all required fields are filled
    const requiredFields = data.section.flatMap((section) =>
      section.fieldData.filter((field) => field.required)
    );

    const emptyFields = requiredFields.filter(
      (field) => !formData[field.inputName]
    );

    if (emptyFields.length > 0) {
      // Alert if any required fields are empty
      setSnackbar({
        open: true,
        message: "Please fill in all required fields.",
        severity: "warning",
      });

      // Set error state to the section containing the first empty required field
      const firstEmptyField = emptyFields[0];
      const sectionWithError = data.section.find((section) =>
        section.fieldData.some(
          (field) => field.inputName === firstEmptyField.inputName
        )
      );
      setErrorState(sectionWithError?.id);
      setErrorField(firstEmptyField.inputName);
    } else {
      setIsLoading(true);
      try {
        const requestData = {
          pid: formData.propertyIdentificationNumber,
          prop_addr: formData.propertyAddress,
          street_name: formData.streetName,
          asset_no: formData.assetNumber,
          cadastral_zone: formData.cadestralZone,
          prop_type: formData.propertyType,
          prop_use: formData.propertyUse,
          rating_dist: formData.ratingDistrict,
          annual_value: formData.annualValue,
          rate_payable: formData.ratePayable,
          grand_total: formData.grandTotal,
          category: formData.category,
          group: formData.group,
          active: "Active",
          occupant: `${formData.occupantsFirstName} ${formData.occupantsLastName}`,
        };

        // Get the bearer token from cookies
        const token = Cookies.get("userToken");

        // Make the POST request
        const response = await axios.post(
          "https://api.revenuehub.skillzserver.com/api/property",
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200 || 201) {
          setSnackbar({
            open: true,
            message: "Property created successfully",
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
              message = "Bad request. Fill in the required fields";
              break;
            case 401:
              message = "You are unauthorized";
              break;
            case 403:
              message = "You are forbidden";
              break;
            default:
              break;
          }
        }
        setSnackbar({ open: true, message, severity: "error" });
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (errorState != undefined) {
      setActiveState(errorState);
    }
  }, [errorState]);

  return (
    <form
      className={`flex-col relative bg-white rounded overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white ${
        propertyModalTransition
          ? "w-6/12 transition-all ease-in-out duration-500"
          : "w-32"
      }`}
      style={{ height: "95vh" }}
      onSubmit={handleFormSubmit}
      method="post"
      // autoComplete="off"
    >
      <img
        src={"/lightCheckeredBackgroundPattern.png"}
        alt="Checkered Background"
        className="absolute top-0 left-0 z-0 w-1/2"
      />
      <div className="absolute z-10 flex-col w-full p-4">
        <div
          className="flex items-start justify-between"
          style={{ height: "10vh" }}
        >
          <h3 className="text-base font-bold text-color-text-two">
            NEW PROPERTY REGISTRATION
          </h3>
          <div className="flex items-center justify-between w-64 gap-4">
            <button
              className="w-1/2 text-xs text-color-dark-red font-lexend font-medium px-0.5 py-2 border-0.6 border-color-dark-red rounded"
              onClick={hideAddPropertyModal}
              type="button"
              title="Close Add New Property Modal"
            >
              Close
            </button>
            <button
              className="w-1/2 text-xs text-white font-lexend font-medium bg-primary-color px-0.5 py-2 rounded"
              title="Save Changes"
              type="submit"
            >
              {isLoading ? "Submitting..." : "Save Changes"}
            </button>
          </div>
        </div>
        <div className="flex-col pt-10 space-y-4">
          <div className="flex items-center justify-between w-6/12 gap-2 p-0.5 border-0.6 border-custom-color-one rounded">
            {data.section.map((item) => (
              <button
                key={item.id}
                className={`text-xs text-color-text-two font-lexend px-2 py-1 ${
                  activateState === item.id
                    ? "text-white font-medium bg-primary-color rounded"
                    : ""
                }`}
                type="button"
                onClick={() => {
                  setActiveState(item.id);
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div className="flex-col pb-8 space-y-3">
            {data.section.map(
              (sectionItem) =>
                activateState === sectionItem.id &&
                sectionItem.fieldData.map((fieldItem) =>
                  fieldItem.inputType === "text" ? (
                    <input
                      key={fieldItem.id}
                      type={fieldItem.inputType}
                      name={fieldItem.inputName}
                      value={formData[fieldItem.inputName] || ""}
                      className={`w-full text-xs font-lexend h-12 px-4 py-2 border-0.6 outline-none rounded ${
                        formData[fieldItem.inputName]
                          ? "border-color-dark-green text-color-text-one"
                          : errorField === fieldItem.inputName
                          ? "border-0.6 border-color-dark-red text-color-text-one"
                          : "border-custom-color-one text-color-text-two"
                      }`}
                      onChange={handleChange}
                      placeholder={
                        errorField === fieldItem.inputName
                          ? fieldItem.placeholder + " is required *"
                          : fieldItem.placeholder
                      }
                      required={fieldItem.required}
                    />
                  ) : (
                    <select
                      key={fieldItem.id}
                      name={fieldItem.inputName}
                      value={formData[fieldItem.inputName] || ""}
                      className={`w-full text-xs font-lexend h-12 px-3 py-2 border-0.6 outline-none rounded ${
                        formData[fieldItem.inputName]
                          ? "border-color-dark-green text-color-text-one"
                          : errorField === fieldItem.inputName
                          ? "border-0.6 border-color-dark-red text-color-text-one"
                          : "border-custom-color-one text-color-text-two"
                      }`}
                      onChange={handleChange}
                      required={fieldItem.required}
                    >
                      <option value="">
                        Select {fieldItem.placeholder}
                        {errorField === fieldItem.inputName
                          ? " is required *"
                          : ""}
                      </option>
                      {fieldItem.options?.map((option) => (
                        <option
                          key={option.id}
                          value={option.name}
                          className="mb-4"
                        >
                          {option.name}
                        </option>
                      ))}
                    </select>
                  )
                )
            )}
          </div>
        </div>
      </div>
      <CustomAlert
        isOpen={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        handleClose={handleSnackbarClose}
      />
    </form>
  );
};

export default AddProperty;
