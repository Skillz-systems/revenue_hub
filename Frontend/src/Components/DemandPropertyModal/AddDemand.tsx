import React from "react";
import { data } from "./inputFieldData";

interface AddPropertyProps {
  hideAddDemandModal: () => void;
  propertyModalTransition: boolean;
}

const AddProperty: React.FC<AddPropertyProps> = ({
  hideAddDemandModal,
  propertyModalTransition,
}) => {
  return (
    <div
      className={`flex-col relative min-w-[290px] sm:min-w-[350px] md:min-w-[500px] bg-white rounded overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white ${
        propertyModalTransition
          ? "lg:w-4/12 transition-all ease-in-out duration-500"
          : "w-32"
      }`}
      style={{ height: "95vh" }}
    >
      <img
        src={"/lightCheckeredBackgroundPattern.png"}
        alt="Checkered Background"
        className="absolute top-0 left-0 z-0 w-1/2"
      />
      <div className="absolute z-10 flex-col w-full p-4 space-y-16">
        <div
          className="flex items-start justify-between"
          style={{ height: "10vh" }}
        >
          <h3 className="text-base font-bold text-color-text-two">
            NEW DEMAND NOTICE
          </h3>
          <button
            className="w-1/5 text-xs text-color-dark-red font-lexend font-medium px-0.5 py-2 border-0.6 border-color-dark-red rounded"
            onClick={hideAddDemandModal}
            type="button"
            title="Close Add New Property Modal"
          >
            Close
          </button>
        </div>
        <div className="flex-col space-y-6">
          <select
            name={"properties"}
            className={`w-full text-xs text-color-text-two font-lexend px-3 py-4 border-0.6 border-custom-color-one outline-none rounded`}
          >
            <option value="Select Property">Select Property</option>
            {data.properties.propertyId.map((property) => (
              <option key={property} value={property}>
                {property}
              </option>
            ))}
          </select>
          <div className="flex">
            <button
              className="w-full text-sm text-white font-lexend font-medium px-6 py-3 border-0.6 bg-primary-color rounded"
              onClick={() => alert("Generate Invoice")}
              type="button"
              title="Close Add New Property Modal"
            >
              Generate Demand Notice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
