import React, { useState, useEffect } from "react";
import {
  PropertyCard,
  Pagination,
  DemandPropertyModal,
  ViewPropertyModal,
  userData,
  LoadingSpinner,
  CustomAlert,
  paginationStyles,
} from "../Components/Index";
import { BsCaretDownFill } from "react-icons/bs";
import {
  ScrollToTop,
  fetcher,
  useTokens,
  useTriggerError,
} from "../Utils/client";
import useSWR from "swr";

type PropertyData = {
  active: string;
  annual_value: string;
  asset_no: string;
  cadastral_zone: string;
  category: string | null;
  demand_notice: {
    id: number;
    payments: {
      tx_ref: string;
      pin: string;
      actual_amount: number;
      charged_amount: number;
      app_fee: number;
      merchant_fee: number;
      status: string;
    }[];
    amount: string;
    arrears_amount: string;
    penalty: string;
    status: number;
    property: string;
    date_created: string;
  }[];
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
  const [districtState, setDistrictState] = useState<string>("");
  const [propertyUseState, setPropertyUseState] = useState<string>("");
  const [viewPropertyModal, setViewPropertyModal] = useState<any>(null);
  const [propertyModalTransition, setPropertyModalTransition] =
    useState<boolean>(false);
  const [propertyInformation, setPropertyInformation] = useState<
    PropertyArray | any
  >();
  const [paginationMeta, setPaginationMeta] = useState({
    currentPage: 0,
    lastPage: 0,
    total: 0,
    perPage: 0,
  });
  const { staticInformation } = userData();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const triggerError = useTriggerError();
  const propertiesPerPage = paginationMeta.perPage;

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const { data, error } = useSWR(
    token
      ? `https://api.revenuehub.skillzserver.com/api/property?page=${paginationMeta.currentPage}`
      : null,
    (url) => fetcher(url, token)
  );

  useEffect(() => {
    if (data) {
      setPropertyInformation(data.data);
      setPaginationMeta({
        currentPage: data.meta.current_page,
        lastPage: data.meta.last_page,
        total: data.meta.total,
        perPage: data.meta.per_page,
      });
      setSnackbar({
        open: true,
        message: "Properties fetched successfully",
        severity: "success",
      });
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: `Error fetching Property Data: ${error}`,
        severity: "warning",
      });
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
  const [currentStyle, setCurrentStyle] = useState<number | undefined>(
    undefined
  );

  const offset = currentPage * propertiesPerPage;

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPaginationMeta((prev) => ({
      ...prev,
      currentPage: selected + 1, // SWR uses 1-based index for pages
    }));
    ScrollToTop("top-container");
  };

  const handlePropertiesPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    ScrollToTop("top-container");
  };

  const currentProperties = propertyInformation?.slice(
    offset,
    offset + propertiesPerPage
  );

  // PAGINATION LOGIC END

  const LengthByFilterState = (): number => {
    return paginationMeta.total;
  };

  const pageCount = Math.ceil(LengthByFilterState() / propertiesPerPage);

  return (
    <div>
      {propertyInformation ? (
        <>
          <hr className="border-0.5 mb-8 border-custom-grey-100" />
          <div
            id="top-container"
            className="border-0.6 border-custom-grey-100 rounded"
          >
            <div className="flex items-center justify-between p-4 bg-very-light-grey">
              <p className="text-base font-bold text-color-text-two">
                ALL PROPERTIES
              </p>
              <div
                className="flex items-center justify-end gap-3"
                onClick={() => {
                  setSnackbar({
                    open: true,
                    message: "Disabled Feature. Coming soon.",
                    severity: "warning",
                  });
                }}
              >
                <div
                  className="flex items-center justify-between gap-2 pr-1.5 border rounded border-divider-grey text-color-text-two"
                  title="Filter by District"
                >
                  <select
                    className="hover:cursor-pointer p-2 py-1.5 overflow-y-auto text-xs font-medium rounded outline-none appearance-none font-lexend overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white pointer-events-none"
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
                    className="hover:cursor-pointer p-2 py-1.5 overflow-y-auto text-xs font-medium rounded outline-none appearance-none font-lexend overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white pointer-events-none"
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
                  className="text-xs pointer-events-none font-semi-bold font-lexend text-color-bright-red hover:cursor-pointer"
                  onClick={ResetFilters}
                >
                  Reset Filters
                </p>
              </div>
            </div>

            {/* DATA AREA START */}
            <div className="flex flex-wrap items-center justify-start p-4 gap-y-4 gap-x-4">
              {districtState && propertyUseState ? (
                propertyInformation.length > 0 ? (
                  propertyInformation.map((property) => (
                    // SHOW ALL PROPERTIES
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
                propertyInformation.length > 0 ? (
                  propertyInformation.map((property) => (
                    // SHOW ALL DISTRICTS
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
                propertyInformation.length > 0 ? (
                  propertyInformation.map((property) => (
                    // SHOW ALL PROPERTY USE
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
                  // SHOW CURRENT FILTER DATA
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
                  pageCount={paginationMeta.lastPage}
                  pageRangeDisplayed={2}
                  marginPagesDisplayed={0}
                  onPageChange={handlePageChange}
                  paginationStyles={paginationStyles}
                  forcePage={paginationMeta.currentPage - 1} // Pagination component uses 0-based index for pages
                />
              </div>
              <p className="flex items-center gap-2 justify-end w-[30%] text-xs text-color-text-two font-lexend">
                Showing
                <select
                  className="flex items-center outline-none justify-center w-[45px] h-[32px] px-2.5 border border-divider-grey rounded text-color-text-one appearance-none bg-transparent"
                  onChange={handlePropertiesPerPageChange}
                  value={
                    paginationMeta.perPage > paginationMeta.total
                      ? paginationMeta.total
                      : paginationMeta.perPage
                  }
                  disabled
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    appearance: "none",
                  }}
                >
                  <option
                    value={
                      paginationMeta.perPage > paginationMeta.total
                        ? paginationMeta.total
                        : paginationMeta.perPage
                    }
                  >
                    {paginationMeta.perPage > paginationMeta.total
                      ? paginationMeta.total
                      : paginationMeta.perPage}
                  </option>
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
        <LoadingSpinner title="Loading Properties" />
      )}
      <CustomAlert
        isOpen={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        handleClose={handleSnackbarClose}
      />
    </div>
  );
}
