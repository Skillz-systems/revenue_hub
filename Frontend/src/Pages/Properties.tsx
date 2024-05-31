import React, { useState, useEffect } from "react";
import {
  PropertyCard,
  Pagination,
  DemandPropertyModal,
  ViewPropertyModal,
  Card,
  CardData,
  userData,
} from "../Components/Index";
import { BsCaretDownFill } from "react-icons/bs";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { ScrollToTop, fetcher, useTokens } from "../Utils/client";
import useSWR from "swr";

type PropertyData = {
  active: string;
  annual_value: string;
  asset_no: string;
  cadastral_zone: string;
  category: string | null;
  demand_notice: any[];
  grand_total: string;
  group: string;
  id: number;
  occupant: string;
  pid: string;
  prop_addr: string;
  prop_type: string;
  prop_use: string;
  rate_payable: number;
  rating_dist: string;
  status: string;
  street_name: string;
  demand_notice_status: string;
};

type PropertyArray = PropertyData[];

export default function Properties() {
  const { token } = useTokens();
  const cardData = CardData();
  const [districtState, setDistrictState] = useState<string>("");
  const [propertyUseState, setPropertyUseState] = useState<string>("");
  const [viewPropertyModal, setViewPropertyModal] = useState<any>(null);
  const [propertyModalTransition, setPropertyModalTransition] =
    useState<boolean>(false);
  const [propertyInformation, setPropertyInformation] = useState<
    PropertyArray | any
  >();
  const { staticInformation } = userData();

  const { data, error } = useSWR(
    token ? "https://api.revenuehub.skillzserver.com/api/property" : null, // Only fetch if token exists
    (url) => fetcher(url, token)
  );

  useEffect(() => {
    if (data) {
      setPropertyInformation(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching Property Data:", error);
    }
  }, [data]);

  const handleViewPropertyModal = (property: any) => {
    setViewPropertyModal(property);
    setTimeout(() => {
      setPropertyModalTransition(true);
    }, 250);
  };

  const handleSelectDistrict = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedDistrict = event.target.value;
    if (selectedDistrict === "All Districts") {
      setDistrictState("");
    } else {
      setDistrictState(selectedDistrict);
      setCurrentPage(0);
      setCurrentStyle(0);
    }
  };

  const handleSelectPropertyUse = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedPropertyUse = event.target.value;
    if (selectedPropertyUse === "All Property Use") {
      setPropertyUseState("");
    } else {
      setPropertyUseState(selectedPropertyUse);
      setCurrentPage(0);
      setCurrentStyle(0);
    }
  };

  const ResetFilters = () => {
    setDistrictState("");
    setPropertyUseState("");
  };

  // PAGINATION LOGIC START
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [propertiesPerPage, setPropertiesPerPage] = useState<number>(12);
  const [currentStyle, setCurrentStyle] = useState<number | undefined>(
    undefined
  );

  const offset = currentPage * propertiesPerPage;

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
    ScrollToTop("top-container");
  };

  const handlePropertiesPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPropertiesPerPage(parseInt(e.target.value));
    ScrollToTop("top-container");
  };

  const currentProperties = propertyInformation?.slice(
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
    ? propertyInformation.filter((record) =>
        Object.values(record).some((value) => {
          if (typeof value === "string") {
            return value.toLowerCase().includes(districtState.toLowerCase());
          }
          return false;
        })
      )
    : [];

  const filteredPropertyUseResults = propertyUseState
    ? propertyInformation.filter((record) =>
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

  const LengthByFilterState = (): number => {
    return districtState !== ""
      ? filteredDistrictResults.length > 0
        ? filteredDistrictResults.length
        : 0
      : propertyUseState !== ""
      ? filteredPropertyUseResults.length > 0
        ? filteredPropertyUseResults.length
        : 0
      : propertyInformation?.length;
  };

  const pageCount = Math.ceil(LengthByFilterState() / propertiesPerPage);

  return (
    <div>
      {propertyInformation ? (
        <>
          <div className="grid grid-cols-2 gap-x-3 gap-y-3 md:grid-cols-3 md:gap-x-4 md:gap-y-8">
            {cardData.map((card) => (
              <Card
                id={card.id}
                icon={card.icon}
                description={card.description}
                name={card.name}
                value={card.value}
                containerStyle={`flex flex-col items-start p-2 space-y-4 lg:p-4 lg:space-y-8 border-0.6 w-full border-custom-color-one shadow rounded
                ${card.id === 1 && "bg-custom-grey-200"}`}
                iconStyle={`flex items-center justify-center w-6 lg:w-10 h-6 lg:h-10 lg:p-2 text-base lg:text-2xl rounded 
                ${
                  [1, 2, 3].includes(card.id) &&
                  "bg-custom-blue-200 text-primary-color"
                }
                ${card.id === 4 && "bg-color-light-green text-color-dark-green"}
                ${
                  [5, 6].includes(card.id) &&
                  "bg-color-light-yellow text-color-bright-orange"
                }
              `}
                descriptionStyle={
                  "text-[10px] lg:text-xs text-color-text-two font-lexend"
                }
                nameStyle={
                  "text-xs lg:text-sm font-medium lg:font-semibold text-color-text-one font-lexend"
                }
                currencyStyle={"text-sm lg:text-2xl text-color-bright-green"}
                valueStyle={"text-lg lg:text-3xl"}
              />
            ))}
          </div>
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
                    {staticInformation.cadestralZones.map((district, index) => (
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
                    {staticInformation.propertyUse.map((type, index) => (
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
                      id={property.id}
                      personalIdentificationNumber={property.pid}
                      propertyUse={property.prop_use}
                      paymentStatus={property.demand_notice_status}
                      propertyAddress={property.prop_addr}
                      group={property.group}
                      cadestralZone={property.cadastral_zone}
                      ratePaybale={property.rate_payable}
                      occupationStatus={"Occupied"}
                      setViewPropertyModal={() =>
                        handleViewPropertyModal(property)
                      }
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
                      id={property.id}
                      personalIdentificationNumber={property.pid}
                      propertyUse={property.prop_use}
                      paymentStatus={property.demand_notice_status}
                      propertyAddress={property.prop_addr}
                      group={property.group}
                      cadestralZone={property.cadastral_zone}
                      ratePaybale={property.rate_payable}
                      occupationStatus={"Occupied"}
                      setViewPropertyModal={() =>
                        handleViewPropertyModal(property)
                      }
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
                      id={property.id}
                      personalIdentificationNumber={property.pid}
                      propertyUse={property.prop_use}
                      paymentStatus={property.demand_notice_status}
                      propertyAddress={property.prop_addr}
                      group={property.group}
                      cadestralZone={property.cadastral_zone}
                      ratePaybale={property.rate_payable}
                      occupationStatus={"Occupied"}
                      setViewPropertyModal={() =>
                        handleViewPropertyModal(property)
                      }
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
                    id={property.id}
                    personalIdentificationNumber={property.pid}
                    propertyUse={property.prop_use}
                    paymentStatus={property.demand_notice_status}
                    propertyAddress={property.prop_addr}
                    group={property.group}
                    cadestralZone={property.cadastral_zone}
                    ratePaybale={property.rate_payable}
                    occupationStatus={"Occupied"}
                    setViewPropertyModal={() =>
                      handleViewPropertyModal(property)
                    }
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
                  setViewPropertyModal(null);
                  setTimeout(() => {
                    setPropertyModalTransition(false);
                  }, 300);
                }}
                propertyModalTransition={propertyModalTransition}
                customTableData={viewPropertyModal}
              />
            </DemandPropertyModal>
          ) : null}
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
