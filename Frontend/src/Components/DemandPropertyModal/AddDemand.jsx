import React from "react";
import { TopNavigation } from "../Index";
import { data } from "./inputFieldData";

export default function AddDemand({ hideAddDemandModal }) {
  return (
    <div className="flex-col border-0.6 border-custom-color-one rounded-b">
      <TopNavigation
        userName={"John"}
        handleMenuClick={() => {
          alert("Opened Menu Modal");
        }}
        parentStyle={"bg-white"}
      />
      <div
        className="flex justify-center p-4 pt-8 bg-custom-grey-200"
        style={{ height: "81vh" }}
      >
        <div
          className="flex-col relative w-1/2 bg-white border-0.6 border-custom-color-one rounded"
          style={{ height: "50vh" }}
        >
          <img
            src={"/lightCheckeredBackgroundPattern.png"}
            alt="Checkered Background"
            className="absolute top-0 left-0 z-0 w-1/2"
          />
          <div className="absolute z-10 flex-col w-full h-full p-4 space-y-20">
            <div
              className="z-10 flex items-start justify-between"
              style={{ height: "10vh" }}
            >
              <h3 className="text-base font-bold text-color-text-two">
                NEW DEMAND NOTICE
              </h3>
              <button
                className="w-1/4 text-xs text-color-dark-red font-lexend font-medium px-0.5 py-2 border-0.6 border-color-dark-red rounded"
                onClick={hideAddDemandModal}
                type="button"
                title="Close Add New Property Modal"
              >
                Close
              </button>
            </div>
            <div className="flex-col space-y-4">
              <select
                name={"properties"}
                readOnly
                className={`w-full text-xs text-color-text-two font-lexend px-3 py-4 border-0.6 border-custom-color-one outline-none rounded`}
              >
                <option value="Select Property">Select Property</option>
                {data.properties.propertyId.map((property) => (
                  <option key={property} value={property}>
                    {property}
                  </option>
                ))}
              </select>
              <div className="flex justify-end">
                <button
                  className="w-auto text-sm text-white font-lexend font-medium px-6 py-3 border-0.6 bg-primary-color rounded"
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
      </div>
    </div>
  );
}
