import React from "react";
import { PropertyCard, customTableData } from "../Index";
import { BsCaretDownFill } from "react-icons/bs";

export default function Properties() {
  return (
    <div className="border-0.6 border-custom-grey-100 rounded">
      <div className="flex items-center justify-between p-4 bg-very-light-grey">
        <p className="text-base font-bold text-color-text-two">
          ALL PROPERTIES
        </p>
        <div className="flex gap-2 text-xs font-medium font-lexend">
          <button
            className="flex items-center justify-between gap-2 px-3 py-1 border rounded text-color-text-two border-divider-grey hover:cursor-pointer"
            title="Filter by District"
          >
            District
            <span>
              <BsCaretDownFill />
            </span>
          </button>
          <button
            className="flex items-center justify-between gap-2 px-3 py-1 border rounded text-color-text-two border-divider-grey hover:cursor-pointer"
            title="Filter by Property Use"
          >
            Property Use
            <span>
              <BsCaretDownFill />
            </span>
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between p-4 gap-y-5">
        {customTableData.properties.records.map((property) => (
          <PropertyCard
            id={property.id}
            pin={property.pin}
            propertyUse={property.propertyUse}
            paymentStatus={property.paymentStatus}
            address={property.address}
            amacZone={property.amacZones}
            cadestralZone={property.cadestralZone}
            ratePaybale={property.ratePayable}
          />
        ))}
      </div>
      <div className="p-4">
        <b className="p-1 text-sm ">PAGINATION COMPONENT</b>
      </div>
    </div>
  );
}
