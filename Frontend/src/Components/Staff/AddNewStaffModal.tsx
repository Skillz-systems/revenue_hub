import React, { useState, ChangeEvent, FormEvent } from "react";
import { data } from "./staffInputData";
import axios from "axios";
import Cookies from "js-cookie";

interface FieldData {
  id: number;
  inputName: string;
  placeholder: string;
  inputType: string;
  options?: { id: number; name: string }[];
  required: boolean;
}

interface FormData {
  [key: string]: string;
}

interface AddNewStaffModalProps {
  hideNewStaffModal: () => void;
  propertyModalTransition: boolean;
}

const AddNewStaffModal: React.FC<AddNewStaffModalProps> = ({
  hideNewStaffModal,
  propertyModalTransition,
}) => {
  const [formData, setFormData] = useState<FormData>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Function to map staff designation to role ID
  const mapDesignationToRoleId = (designation: string): string | null => {
    switch (designation) {
      case "Manager":
        return "1";
      case "Admin":
        return "2";
      case "Enforcer":
        return "3";
      case "Officer":
        return "4";
      default:
        return null;
    }
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check if all required fields are filled
    const requiredFields = data.filter((field) => field.required);
    const emptyFields = requiredFields.filter(
      (field) => !formData[field.inputName]
    );

    if (emptyFields.length > 0) {
      // Alert if any required fields are empty
      alert("Please fill in all required fields.");
    } else {
      setIsLoading(true)
      try {
        // Get selected staff designation and map it to role ID
        const selectedDesignation = formData.staffDesignation;
        const selectedRoleId = mapDesignationToRoleId(selectedDesignation);

        if (selectedRoleId === null) {
          throw new Error("Invalid staff designation");
        }

        // Prepare the request data
        const requestData = {
          name: `${formData.staffFirstName} ${formData.staffMiddleName ? formData.staffMiddleName + " " : ""}${formData.staffLastName}`,
          email: formData.staffEmail,
          phone: formData.staffPhoneNumber,
          zone: formData.staffZone,
          role_id: selectedRoleId,
        };

        console.log("requestData", requestData);

        // Get the bearer token from cookies
        const token = Cookies.get("userToken");

        // Make the POST request
        const response = await axios.post(
          "https://api.revenuehub.skillzserver.com/api/staff",
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
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized:", error.response.data);
          alert("Unauthorized. Please login again.");
        } else {
          console.error("Error submitting form:", error);
          alert("An error occurred while submitting the form.");
        }
      }
      setIsLoading(false)
    }
  };

  return (
    <form
      className={`flex-col relative bg-white rounded overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white ${propertyModalTransition
        ? "w-5/12 transition-all ease-in-out duration-500"
        : "w-32"
        }`}
      style={{ height: "95vh" }}
      onSubmit={handleFormSubmit}
    // method="post"
    // autoComplete="off"
    >
      <img
        src={"/lightCheckeredBackgroundPattern.png"}
        alt="Checkered Background"
        className="absolute top-0 left-0 z-0 w-1/2"
      />
      <div className="absolute z-10 flex-col w-full p-4 space-y-8 ">
        <div
          className="flex items-start justify-between"
          style={{ height: "10vh" }}
        >
          <h3 className="text-base font-bold text-color-text-two">
            CREATE NEW STAFF
          </h3>
          <div className="flex items-center justify-between w-64 gap-4">
            <button
              className="w-1/2 text-xs text-color-dark-red font-lexend font-medium px-0.5 py-2 border-0.6 border-color-dark-red rounded"
              onClick={hideNewStaffModal}
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
        <div className="flex-col space-y-3">
          {data.map((fieldItem: FieldData) =>
            fieldItem.inputType === "text" ? (
              <input
                key={fieldItem.id}
                type={fieldItem.inputType}
                name={fieldItem.inputName}
                value={formData[fieldItem.inputName] || ""}
                className={`w-full text-xs font-lexend h-12 px-4 py-2 border-0.6 outline-none rounded ${formData[fieldItem.inputName]
                  ? "border-color-dark-green text-color-text-one"
                  : "border-custom-color-one text-color-text-two"
                  }`}
                onChange={handleChange}
                placeholder={fieldItem.placeholder}
                required={fieldItem.required}
              />
            ) : (
              <select
                key={fieldItem.id}
                name={fieldItem.inputName}
                value={formData[fieldItem.inputName] || ""}
                className={`w-full text-xs font-lexend h-12 px-3 py-2 border-0.6 outline-none rounded ${formData[fieldItem.inputName]
                  ? "border-color-dark-green text-color-text-one"
                  : "border-custom-color-one text-color-text-two"
                  }`}
                onChange={handleChange}
                required={fieldItem.required}
              >
                <option value="">
                  Select {fieldItem.placeholder}
                </option>
                {fieldItem.options?.map((option) => (
                  <option key={option.id} value={option.name} className="mb-4">
                    {option.name}
                  </option>
                ))}
              </select>
            )
          )}
        </div>
      </div>
    </form>
  );
};

export default AddNewStaffModal;
