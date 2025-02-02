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
import { BsArrowDownUp } from "react-icons/bs";
import {
  ScrollToTop,
  fetcher,
  useTokens,
  useTriggerError,
} from "../Utils/client";
import useSWR from "swr";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroller';
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

interface SearchInterface {
  property_use_id?: number
  rating_district_id?: number
}
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
  const [search, setSearch] = useState<SearchInterface>({});
  const [propertyUse, setPropertyUse] = useState(0);
  const [url, setUrl] = useState<string | null>("");
  const [preventLoading, setPreventLoading] = useState<boolean>(false);
  const [searchButton, setSearchButton] = useState<boolean>(false);
  const [order, setOrder] = useState<boolean>(true);
  const [searchLoader, setSearchLoader] = useState<boolean>(false);

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
    next: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const triggerError = useTriggerError();
  //const propertiesPerPage = paginationMeta.perPage;

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
      let data: {
        property_use_id?: number
        rating_district_id?: number
        order?: boolean
        search?: string
      } = {
        order: order
      };
      if (ratingDistrict != 0) {
        data["rating_district_id"] = ratingDistrict
      }
      if (propertyUse != 0) {
        data["property_use_id"] = propertyUse
      }
      if (searchQuery.length > 0) {
        data["search"] = searchQuery
      }

      var response: any
      if (propertyUse == 0 && ratingDistrict == 0) {
        response = await axios.post(`${apiUrl}/api/property`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },

        });
      } else {

        response = await axios.post(`${apiUrl}/api/property`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },

        });
      }
      setSearch(data)
      setUrl(response.data.links.next);

      setPropertyInformation(response.data.data);
      setPaginationMeta({
        next: response.data.links.next,
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

  useEffect(() => {
    fetchProperties();

  }, [ratingDistrict, propertyUse])

  // const { data, error } = useSWR(
  //   token ? paginationMeta.next ? paginationMeta.next : `${apiUrl}/api/property` : null,
  //   (url) => fetcher(url, token, "post", search)
  // );

  const handleQueryChange = (event: any) => {
    const query = event.target.value;
    if (query.length >= 1) {
      setSearchButton(true)
    } else {
      setSearchButton(false)
    }
    setSearchQuery(query);
  };

  // const handleSelectCadestralZone = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const selectedCadestralZone = event.target.value;
  //   setCadestralZone(selectedCadestralZone);
  //   fetchProperties();
  // }, [setCadestralZone]);

  useEffect(() => {
    fetchProperties()
  }, []);

  // useEffect(() => {
  //   // if (error) {
  //   //   setSnackbar({
  //   //     open: true,
  //   //     message: `Error fetching Property Data: ${error}`,
  //   //     severity: "warning",
  //   //   });
  //   // }
  // }, []);

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

  //const offset = currentPage * propertiesPerPage;

  const handlePageChange = ({ selected }: { selected: number }) => {
    // setPaginationMeta((prev) => ({
    //   ...prev,
    //   currentPage: selected + 1,
    // }));
    ScrollToTop("top-container");
  };
  const loadMore = async () => {
    if (preventLoading) {
      return;
    }
    try {
      setPreventLoading(true)
      let response = await axios.post(url ? url : "", search, {
        headers: {
          Authorization: `Bearer ${token}`,
        },

      });
      setUrl(response.data.links.next);

      setPropertyInformation([...propertyInformation, ...response.data.data]);
      console.log("should be done", response.data.data)
      setPaginationMeta({
        next: response.data.links.next,
      });
      setPreventLoading(false)
    } catch (error) {
      console.error(error);

    }
  };

  const handleSearch = async () => {
    //show search loader
    setSearchLoader(true)
    await fetchProperties();
    setSearchLoader(false)
    // remove search loader
  }

  // const handlePropertiesPerPageChange = (
  //   e: React.ChangeEvent<HTMLSelectElement>
  // ) => {
  //   ScrollToTop("top-container");
  // };

  // const currentProperties = propertyInformation?.slice(
  //   offset,
  //   offset + propertiesPerPage
  // );

  // const LengthByFilterState = (): number => {
  //   return paginationMeta.total;
  // };

  const switchOrder = async () => {
    if (order) {
      setOrder(false);
    } else {
      setOrder(true);
    }
  }

  useEffect(() => {
    fetchProperties();
  }, [order])


  return (
    <div className="w-full overflow-auto scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white">
      {propertyInformation ? (
        <div className="w-[1000px] lg:w-full ">
          <hr className="border-0.5 mb-8 border-custom-grey-100" />
          <div
            id="top-container"
            className="border-0.6 border-custom-grey-100 rounded "
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
              <div>
                <BsArrowDownUp onClick={switchOrder} className={`${order ? "text-green-500" : "text-red-500"} text-[20px] hover:cursor-pointer`} />
              </div>
              <div
                className="flex items-center justify-between gap-2 pr-1.5 border rounded border-divider-grey text-color-text-two"
                title="Filter by District"
              >
                <select
                  className="hover:cursor-pointer p-2 py-1.5 overflow-y-auto text-xs font-medium rounded outline-none appearance-none font-lexend overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white"
                  onChange={(e: any) => setRatingDistrict(e.target.value)}
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
                  onChange={(e: any) => setPropertyUse(e.target.value)}
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
              {/* <p
                className="text-xs pointer-events-none font-semi-bold font-lexend text-color-bright-red hover:cursor-pointer"
                onClick={ResetFilters}
              >
                Reset Filters
              </p> */}
              <div
                className="flex items-center justify-between gap-2 pr-1.5  "
                title="Filter by Property Use"
              >
                <div>
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

                <div>
                  {searchLoader ? <LoadingSpinner title="" /> : searchButton && (
                    <button
                      type="button"
                      className="w-full  flex items-center justify-between button-gradient-one space-x-1 px-2 py-1 border border-custom-color-two rounded shadow-custom-100"
                      title={"Search"}
                      onClick={handleSearch}
                    >
                      {/* <span className="text-sm text-white">{iconOne}</span> */}
                      <span
                        className="font-medium text-left text-white ellipsis font-lexend w-[85%] lg:w-auto"
                        style={{ fontSize: "0.6875rem" }}
                      >
                        Search

                      </span>
                    </button>
                  )}

                </div>
              </div>
            </div>

            <div id="scrollableDiv"
              className="h-[80vh] overflow-auto no-scrollbar  justify-start p-4 gap-y-4 gap-x-4">
              <InfiniteScroll
                className="flex flex-wrap  justify-start p-4 gap-y-4 gap-x-4"
                pageStart={1}
                loadMore={loadMore}
                hasMore={preventLoading == false && url ? true : false}
                loader={<LoadingSpinner title="Loading More Properties" />}
                useWindow={false}
              >
                {/* {searchQuery ? (
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
                        key={property.id}
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
                )} */}
                {
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
                }
                {preventLoading ? <LoadingSpinner title="Loading More Properties" /> : null}
              </InfiniteScroll>


            </div>

            {/* <div className="flex justify-between p-4 item-center">
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
            </div> */}
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