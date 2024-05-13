import React, { useState } from "react";
import {
  PropertyCard,
  customTableData,
  Pagination,
  DemandPropertyModal,
  ViewPropertyModal,
} from "../Index";
import { BsCaretDownFill } from "react-icons/bs";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { ScrollToTop } from "../../Utils/client";
import { zones, propertyUse } from "../DemandInvoiceTable/customTableData";

export default function Properties() {
  const [districtState, setDistrictState] = useState("");
  const [propertyUseState, setPropertyUseState] = useState("");
  const [viewPropertyModal, setViewPropertyModal] = useState(null);
  const [propertyModalTransition, setPropertyModalTransition] = useState(false);

  const handleViewPropertyModal = (property) => {
    setViewPropertyModal(property);
    setTimeout(() => {
      setPropertyModalTransition(true);
    }, 250);
  };

  const handleSelectDistrict = (event) => {
    const selectedDistrict = event.target.value;
    if (selectedDistrict === "All Districts") {
      setDistrictState("");
    } else {
      setDistrictState(selectedDistrict);
      setCurrentPage(0);
      setCurrentStyle(0);
    }
  };

  const handleSelectPropertyUse = (event) => {
    const selectedPropertyUse = event.target.value;
    if (selectedPropertyUse === "All Property Use") {
      setPropertyUseState("");
    } else {
      setPropertyUseState(selectedPropertyUse);
      setCurrentPage(0);
      setCurrentStyle(0);
    }
  };

  function ResetFilters() {
    setDistrictState("");
    setPropertyUseState("");
  }

  // PAGINATION LOGIC START
  const [currentPage, setCurrentPage] = useState(0);
  const [propertiesPerPage, setPropertiesPerPage] = useState(12);
  const [currentStyle, setCurrentStyle] = useState();

  const offset = currentPage * propertiesPerPage;

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

  const filteredDistrictResults = districtState
    ? customTableData.properties.records.filter((record) =>
        Object.values(record).some((value) => {
          if (typeof value === "string") {
            return value.toLowerCase().includes(districtState.toLowerCase());
          }
          return false;
        })
      )
    : [];

  const filteredPropertyUseResults = propertyUseState
    ? customTableData.properties.records.filter((record) =>
        Object.values(record).some((value) => {
          if (typeof value === "string") {
            return value.toLowerCase().includes(propertyUseState.toLowerCase());
          }
          return false;
        })
      )
    : [];

  //RUN MORE TESTS ON DATA SWITCH
  const filteredCombinedResults =
    districtState !== "" && propertyUseState !== ""
      ? filteredPropertyUseResults.filter((propertyRecord) =>
          filteredDistrictResults.some(
            (districtRecord) => propertyRecord === districtRecord
          )
        )
      : [];

  const pageCount = Math.ceil(LengthByFilterState() / propertiesPerPage);

  function LengthByFilterState() {
    return districtState !== ""
      ? filteredDistrictResults.length > 0
        ? filteredDistrictResults.length
        : 0
      : propertyUseState !== ""
      ? filteredPropertyUseResults.length > 0
        ? filteredPropertyUseResults.length
        : 0
      : customTableData.properties.records.length;
  }

  return (
    <div>
      <hr className="border-0.5 mb-8 border-custom-grey-100" />
      <div
        id="top-container"
        className="border-0.6 border-custom-grey-100 rounded"
      >
        <div className="flex items-center justify-between p-4 bg-very-light-grey">
          <p className="text-base font-bold text-color-text-two">
            ALL PROPERTIES
          </p>
          <div className="flex items-center justify-end gap-3">
            <div
              className="flex items-center justify-between gap-2 pr-1.5 border rounded border-divider-grey text-color-text-two"
              title="Filter by District"
            >
              <select
                className="hover:cursor-pointer p-2 py-1.5 overflow-y-auto text-xs font-medium rounded outline-none appearance-none font-lexend overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white"
                onChange={handleSelectDistrict}
                value={districtState}
              >
                <option value="All Districts"> All Districts</option>
                {zones.map((district, index) => (
                  <option key={index} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              <span className="text-xs">
                <BsCaretDownFill />
              </span>
            </div>
            <div
              className="flex items-center justify-between gap-2 pr-1.5 border rounded border-divider-grey text-color-text-two"
              title="Filter by Property Use"
            >
              <select
                className="hover:cursor-pointer p-2 py-1.5 overflow-y-auto text-xs font-medium rounded outline-none appearance-none font-lexend overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white"
                onChange={handleSelectPropertyUse}
                value={propertyUseState}
              >
                <option value="All Property Use">All Property Use</option>
                {propertyUse.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <span className="text-xs">
                <BsCaretDownFill />
              </span>
            </div>
            <p
              className="text-xs font-semi-bold font-lexend text-color-bright-red hover:cursor-pointer"
              onClick={ResetFilters}
            >
              Reset Filters
            </p>
          </div>
        </div>

        {/* DATA AREA START */}
        <div className="flex flex-wrap items-center justify-start p-4 gap-y-4 gap-x-4">
          {districtState && propertyUseState ? (
            filteredCombinedResults.length > 0 ? (
              filteredCombinedResults.map((property) => (
                <PropertyCard
                  key={property.id}
                  pin={property.pin}
                  propertyUse={property.propertyUse}
                  paymentStatus={property.paymentStatus}
                  address={property.address}
                  amacZone={property.amacZones}
                  cadestralZone={property.cadestralZone}
                  ratePaybale={property.ratePayable}
                  setViewPropertyModal={() => handleViewPropertyModal(property)}
                />
              ))
            ) : (
              <p className="text-sm font-medium font-lexend text-color-text-black">
                No results found.
              </p>
            )
          ) : districtState !== "" ? (
            filteredDistrictResults.length > 0 ? (
              filteredDistrictResults.map((property) => (
                <PropertyCard
                  key={property.id}
                  pin={property.pin}
                  propertyUse={property.propertyUse}
                  paymentStatus={property.paymentStatus}
                  address={property.address}
                  amacZone={property.amacZones}
                  cadestralZone={property.cadestralZone}
                  ratePaybale={property.ratePayable}
                  setViewPropertyModal={() => handleViewPropertyModal(property)}
                />
              ))
            ) : (
              <p className="text-sm font-medium font-lexend text-color-text-black">
                No results found.
              </p>
            )
          ) : propertyUseState !== "" ? (
            filteredPropertyUseResults.length > 0 ? (
              filteredPropertyUseResults.map((property) => (
                <PropertyCard
                  key={property.id}
                  pin={property.pin}
                  propertyUse={property.propertyUse}
                  paymentStatus={property.paymentStatus}
                  address={property.address}
                  amacZone={property.amacZones}
                  cadestralZone={property.cadestralZone}
                  ratePaybale={property.ratePayable}
                  setViewPropertyModal={() => handleViewPropertyModal(property)}
                />
              ))
            ) : (
              <p className="text-sm font-medium font-lexend text-color-text-black">
                No results found.
              </p>
            )
          ) : currentProperties.length > 0 ? (
            currentProperties.map((property) => (
              <PropertyCard
                pin={property.pin}
                propertyUse={property.propertyUse}
                paymentStatus={property.paymentStatus}
                address={property.address}
                amacZone={property.amacZones}
                cadestralZone={property.cadestralZone}
                ratePaybale={property.ratePayable}
                setViewPropertyModal={() => handleViewPropertyModal(property)}
              />
            ))
          ) : (
            <p className="text-sm font-medium font-lexend text-color-text-black">
              No results found.
            </p>
          )}
        </div>
        {/* DATA AREA END */}

        <div className="flex justify-between p-4 item-center">
          <div className="flex flex-wrap w-[70%]">
            <Pagination
              pageCount={pageCount}
              pageRangeDisplayed={2}
              marginPagesDisplayed={0}
              onPageChange={handlePageChange}
              paginationStyles={paginationStyles}
              forcePage={currentStyle}
            />
          </div>
          <p className="flex items-center gap-2 justify-end w-[30%] text-xs text-color-text-two font-lexend">
            Showing
            <select
              className="flex items-center outline-none justify-center w-[60px] h-[32px] px-2.5 border border-divider-grey rounded text-color-text-one"
              onChange={handlePropertiesPerPageChange}
              value={
                LengthByFilterState() > propertiesPerPage
                  ? propertiesPerPage
                  : LengthByFilterState()
              }
            >
              {Array.from({ length: LengthByFilterState() }, (_, index) => (
                <option key={index} value={1 + index}>
                  {1 + index}
                </option>
              ))}
            </select>
            of <span>{LengthByFilterState()}</span>
            entries
          </p>
        </div>
      </div>
      {viewPropertyModal ? (
        <DemandPropertyModal
          modalStyle={
            "absolute top-0 left-0 z-20 flex items-start justify-end w-full h-screen p-4 overflow-hidden bg-black bg-opacity-40"
          }
        >
          <ViewPropertyModal
            hideViewPropertyModal={() => {
              setViewPropertyModal(false);
              setTimeout(() => {
                setPropertyModalTransition(false);
              }, 300);
            }}
            propertyModalTransition={propertyModalTransition}
            customTableData={viewPropertyModal}
          />
        </DemandPropertyModal>
      ) : null}
    </div>
  );
}
