import React, { useState, useEffect } from "react";
import { useCallback } from 'react';
import {
  PropertyCard,
  Pagination,
  DemandPropertyModal,
  ViewPropertyModal,
  userData,
  LoadingSpinner,
  CustomAlert,
  paginationStyles,
  TableSearchInput,
} from "../Components/Index";
import { BsCaretDownFill } from "react-icons/bs";
import {
  ScrollToTop,
  fetcher,
  useTokens,
  useTriggerError,
} from "../Utils/client";
import useSWR from "swr";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
 
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
 
const apiUrl = import.meta.env.VITE_API_URL as string;
 
export default function Properties() {
  const { token } = useTokens();
  const [districtState, setDistrictState] = useState<string>("");
  const [propertyUseState, setPropertyUseState] = useState<string>("");
  const [displaySearchIcon, setDisplaySearchIcon] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [cadestralZone, setCadestralZone] = useState([]);
  const [ratingDistricts, setRatingDistricts] = useState([]);
  const [propertyUses, setPropertyUses] = useState([]);
  const [ratingDistrict, setRatingDistrict] = useState(0);
  const [propertyUse, setPropertyUse] = useState(0);
  // const [staticInformation, setStaticInformation] = useState({
  //   cadestralZones: [],
  //   ratingDistricts: [],
  //   propertyUse: [],
  // });
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
 
  useEffect(() => {
    const fetchRatingDistrict = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/rating-district`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRatingDistricts(response.data.data)
      } catch (error) {
        console.error(error);
      }
    };
 
    const fetchPropertyUse = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/property-use`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPropertyUses(response.data.data)
      } catch (error) {
        console.error(error);
      }
    };
 
    const fetchCadestralZone = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/cadastral-zone`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCadestralZone(response.data.data)
      } catch (error) {
        console.error(error);
      }
    };
 
    fetchCadestralZone();
    fetchRatingDistrict();
    fetchPropertyUse();
  }, [token]);
 
  const fetchProperties = async () => {
    try {
      let data:{
        property_use_id ?: number
        rating_district_id?: number
        } = {};
      if (ratingDistrict != 0) {
        data["rating_district_id"] = ratingDistrict 
      }
      if (propertyUse != 0) {
        data["property_use_id"] = propertyUse
      }
      console.log("data", propertyUse)
      
      if (propertyUse == 0 && ratingDistrict == 0) {
        return
      }
      
      const response = await axios.post(`${apiUrl}/api/property?page=${paginationMeta.currentPage}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        
      });
      setPropertyInformation(response.data.data);
      setPaginationMeta({
        currentPage: response.data.meta.current_page,
        lastPage: response.data.meta.last_page,
        total: response.data.meta.total,
        perPage: response.data.meta.per_page,
      });
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: `Error fetching Property Data: ${error}`,
        severity: "warning",
      });
    }
  };

  useEffect( () => {
 fetchProperties();

  },[ratingDistrict, propertyUse])
 
  const { data, error } = useSWR(
    token ? `${apiUrl}/api/property?page=${paginationMeta.currentPage}` : null,
    (url) => fetcher(url, token, "post")
  );
 
  const handleQueryChange = (event: any) => {
    const query = event.target.value;
    setSearchQuery(query);
 
    if (query.length >= 3) {
      fetchProperties();
    } else {
      setSearchResults([]);
    }
  };
 
  const handleSelectDistrict = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDistrict = event.target.value;
    setDistrictState(selectedDistrict);
    fetchProperties();
  }, [setDistrictState]);
 
  const handleSelectPropertyUse = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPropertyUse = event.target.value;
    setPropertyUseState(selectedPropertyUse);
    fetchProperties();
  }, [setPropertyUseState]);
 
  // const handleSelectCadestralZone = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const selectedCadestralZone = event.target.value;
  //   setCadestralZone(selectedCadestralZone);
  //   fetchProperties();
  // }, [setCadestralZone]);
 
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
 
  const ResetFilters = () => {
    setDistrictState("");
    setPropertyUseState("");
  };
 
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [currentStyle, setCurrentStyle] = useState<number | undefined>(
    undefined
  );
 
  const offset = currentPage * propertiesPerPage;
 
  const handlePageChange = ({ selected }: { selected: number }) => {
    setPaginationMeta((prev) => ({
      ...prev,
      currentPage: selected + 1,
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
 
  const LengthByFilterState = (): number => {
    return paginationMeta.total;
  };
 
  const pageCount = Math.ceil(LengthByFilterState() / propertiesPerPage);
 
  return (
    <div className="w-full overflow-auto scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white">
      {propertyInformation ? (
        <div className="w-[1000px] lg:w-full">
          <hr className="border-0.5 mb-8 border-custom-grey-100" />
          <div
            id="top-container"
            className="border-0.6 border-custom-grey-100 rounded"
          >
            <div className="flex items-center justify-between p-4 bg-very-light-grey">
              <p className="text-base font-bold text-color-text-two">
                ALL PROPERTIES
              </p>
 
              {/* <div
                className="flex items-center justify-between gap-2 pr-1.5 border rounded border-divider-grey text-color-text-two"
                title="Filter by District"
              >
                <select
                  className="hover:cursor-pointer p-2 py-1.5 overflow-y-auto text-xs font-medium rounded outline-none appearance-none font-lexend overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white"
                // onChange={handleSelectCadestralZone}
                // value={cadestralZone.id}
                >
                  <option value="">Cadestral Zone</option>
                  {cadestralZone.map((cadestralZone: any, index) => (
                    <option key={index} value={cadestralZone.id}>
                      {cadestralZone.name}
                    </option>
                  ))}
                </select>
                <span className="text-xs">
                  <BsCaretDownFill />
                </span>
              </div> */}
              <div
                className="flex items-center justify-between gap-2 pr-1.5 border rounded border-divider-grey text-color-text-two"
                title="Filter by District"
              >
                <select
                  className="hover:cursor-pointer p-2 py-1.5 overflow-y-auto text-xs font-medium rounded outline-none appearance-none font-lexend overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white"
                  onChange={(e: any)  => setRatingDistrict(e.target.value)}
                  value={ratingDistrict}
                >
                  <option value="0"> All Districts</option>
                  {ratingDistricts.map((district: any, index) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
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
                  onChange={(e: any)  => setPropertyUse(e.target.value)}
                  value={propertyUse}
                >
                  <option value="0">All Property Use</option>
                  {propertyUses.map((type: any, index) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
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
 
              <TableSearchInput
                parentBoxStyle="flex items-center justify-between p-2 bg-custom-grey-100 rounded-3xl border border-custom-color-one"
                inputBoxStyle={` ${displaySearchIcon ? "w-10/12" : "w-full"} text-xs outline-none bg-inherit font-lexend text-color-text-two`}
                iconBoxStyle={"text-base text-primary-color hover:cursor-pointer"}
                placeholder={"Search records"}
                searchIcon={<FiSearch />}
                handleOnInput={handleQueryChange}
                displaySearchIcon={displaySearchIcon}
                query={searchQuery}
                setSnackBar={setSnackbar}
                handleQueryChange={handleQueryChange} />
            </div>
 
            <div className="flex flex-wrap items-center justify-start p-4 gap-y-4 gap-x-4">
              {searchQuery ? (
                searchResults.length > 0 ? (
                  searchResults.map((property: any) => (
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
                      setViewPropertyModal={() => handleViewPropertyModal(property)}
                    />
                  ))
                ) : (
                  <p className="text-sm font-medium font-lexend text-color-text-black">
                    No results found.
                  </p>
                )
              ) : districtState && propertyUseState ? (
                propertyInformation.length > 0 ? (
                  propertyInformation.map((property: any) => (
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
                      setViewPropertyModal={() => handleViewPropertyModal(property)}
                    />
                  ))
                ) : (
                  <p className="text-sm font-medium font-lexend text-color-text-black">
                    No results found.
                  </p>
                )
              ) : districtState !== "" ? (
                propertyInformation.length > 0 ? (
                  propertyInformation.map((property: any) => (
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
                      setViewPropertyModal={() => handleViewPropertyModal(property)}
                    />
                  ))
                ) : (
                  <p className="text-sm font-medium font-lexend text-color-text-black">
                    No results found.
                  </p>
                )
              ) : propertyUseState !== "" ? (
                propertyInformation.length > 0 ? (
                  propertyInformation.map((property: any) => (
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
                      setViewPropertyModal={() => handleViewPropertyModal(property)}
                    />
                  ))
                ) : (
                  <p className="text-sm font-medium font-lexend text-color-text-black">
                    No results found.
                  </p>
                )
              ) : (
                currentProperties.length > 0 ? (
                  currentProperties.map((property: any) => (
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
                      setViewPropertyModal={() => handleViewPropertyModal(property)}
                    />
                  ))
                ) : (
                  <p className="text-sm font-medium font-lexend text-color-text-black">
                    No results found.
                  </p>
                )
              )}
            </div>
 
            <div className="flex justify-between p-4 item-center">
              <div className="flex flex-wrap w-[70%]">
                <Pagination
                  pageCount={paginationMeta.lastPage}
                  pageRangeDisplayed={2}
                  marginPagesDisplayed={0}
                  onPageChange={handlePageChange}
                  paginationStyles={paginationStyles}
                  forcePage={paginationMeta.currentPage - 1}
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
        </div>
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