import React, { useState } from "react";
import { PropertyCard, customTableData, Pagination } from "../Index";
import { BsCaretDownFill } from "react-icons/bs";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { ScrollToTop } from "../../Utils/client";

export default function Properties() {
  // PAGINATION LOGIC START
  const [currentPage, setCurrentPage] = useState(0);
  const [propertiesPerPage, setPropertiesPerPage] = useState(12);

  const offset = currentPage * propertiesPerPage;
  const pageCount = Math.ceil(
    customTableData.properties.records.length / propertiesPerPage
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    ScrollToTop("top-container");
  };

  const handlePropertiesPerPageChange = (e) => {
    setPropertiesPerPage(parseInt(e.target.value));
    ScrollToTop("top-container");
  };

  const currentProperties = customTableData.properties.records.slice(
    offset,
    offset + propertiesPerPage
  );

  const paginationStyles = {
    containerClassName: "flex flex-wrap font-lexend space-x-2",
    activeClassName:
      "flex items-center justify-center px-2.5 w-[32px] h-[32px] bg-custom-blue-200 border border-primary-color rounded ",
    activeLinkClassName: "text-sm text-primary-color font-mulish font-bold",
    previousClassName:
      "flex items-center justify-center h-[32px] px-2.5 border border-divider-grey rounded",
    previousLinkClassName: "text-sm text-color-text-one",
    nextClassName:
      "flex items-center justify-center h-[32px] px-2.5 border border-divider-grey rounded",
    nextLinkClassName: "text-sm text-color-text-one",
    pageClassName:
      "flex items-center justify-center w-[32px] h-[32px] px-2.5 border border-divider-grey rounded",
    pageLinkClassName: "text-sm text-color-text-two font-mulish",
    breakLabel: <HiOutlineDotsHorizontal />,
    breakClassName:
      "flex items-center justify-center h-[32px] px-2 border border-divider-grey rounded",
    breakLinkClassName: "text-base text-color-text-two font-mulish",
  };
  // PAGINATION LOGIC END

  return (
    <div
      id="top-container"
      className="border-0.6 border-custom-grey-100 rounded"
    >
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
      <div className="flex flex-wrap items-center justify-start p-4 gap-y-4 gap-x-4">
        {currentProperties.map((property) => (
          <PropertyCard
            key={property.id}
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
      <div className="flex justify-between p-4 item-center">
        <div className="flex flex-wrap w-[70%]">
          <Pagination
            pageCount={pageCount}
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
            onPageChange={handlePageChange}
            paginationStyles={paginationStyles}
          />
        </div>
        <p className="flex items-center gap-2 justify-end w-[30%] text-xs text-color-text-two font-lexend">
          Showing
          <select
            className="flex items-center outline-none justify-center w-[60px] h-[32px] px-2.5 border border-divider-grey rounded text-color-text-one"
            onChange={handlePropertiesPerPageChange}
            value={propertiesPerPage}
          >
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index} value={1 + index}>
                {1 + index}
              </option>
            ))}
          </select>
          of {customTableData.properties.records.length} entries
        </p>
      </div>
    </div>
  );
}
