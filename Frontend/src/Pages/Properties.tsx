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
import { set } from "mobx";
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
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingCadastralZone, setLoadingCadastralZone] = useState(false);
  const [propertyLoader, setPropertyLoader] = useState(false);
  const [loadingStreet, setLoadingStreet] = useState(false);
  const [ratingDistricts, setRatingDistricts] = useState([]);
  const [propertyUses, setPropertyUses] = useState([]);
  const [ratingDistrict, setRatingDistrict] = useState(0);
  const [cadastralZone, setCadastralZone] = useState(0);
  const [street, setStreet] = useState(0);
  const [cadastralZones, setCadastralZones] = useState([]);
  const [streets, setStreets] = useState([]);
  const [search, setSearch] = useState<SearchInterface>({});
  const [propertyUse, setPropertyUse] = useState(0);
  const [url, setUrl] = useState<string | null>("");
  const [preventLoading, setPreventLoading] = useState<boolean>(false);
  const [searchButton, setSearchButton] = useState<boolean>(false);
  const [order, setOrder] = useState<boolean>(true);
  const [searchLoader, setSearchLoader] = useState<boolean>(false);

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


  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const fetchRatingDistrict = async () => {
      setCadastralZones([])
      setCadastralZone(0)
      setStreets([])
      setStreet(0)

      try {
        const response = await axios.get(`${apiUrl}/api/rating-district`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRatingDistricts(response.data.data)
        if (ratingDistrict > 0) {
          fetchProperties()
        }
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

    // const fetchCadestralZone = async () => {
    //   try {
    //     const response = await axios.get(`${apiUrl}/api/cadastral-zone`, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });
    //     setCadestralZone(response.data.data)
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };

    // fetchCadestralZone();
    fetchRatingDistrict();
    fetchPropertyUse();
  }, [token]);

  // const fetchProperties = async () => {

  //   try {
  //     let data: {
  //       property_use_id?: number
  //       rating_district_id?: number
  //       cadastral_zone_id?: number
  //       street_id?: number
  //       order?: boolean
  //       search?: string
  //     } = {
  //       order: order
  //     };
  //     if (ratingDistrict != 0) {
  //       data["rating_district_id"] = ratingDistrict
  //     }
  //     if (propertyUse != 0) {
  //       data["property_use_id"] = propertyUse;
  //     }
  //     if (cadastralZone != 0) {
  //       data["cadastral_zone_id"] = cadastralZone;
  //     }
  //     if (street != 0) {
  //       data["street_id"] = street
  //     }
  //     if (searchQuery.length > 0) {
  //       data["search"] = searchQuery
  //     }

  //     var response: any
  //     if (propertyUse == 0 && ratingDistrict == 0) {
  //       response = await axios.post(`${apiUrl}/api/property`, data, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },

  //       });
  //     } else {

  //       response = await axios.post(`${apiUrl}/api/property`, data, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },

  //       });
  //     }
  //     setSearch(data)
  //     setUrl(response.data.links.next);

  //     setPropertyInformation(response.data.data);
  //     setPaginationMeta({
  //       next: response.data.links.next,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     setSnackbar({
  //       open: true,
  //       message: `Error fetching Property Data: ${error}`,
  //       severity: "warning",
  //     });
  //   }
  // };
  // const fetchCadastralZone = async () => {
  //   //setStreets([])
  //   setStreet(0)
  //   try {
  //     const response = await axios.get(`${apiUrl}/api/cadastral-zone/by-rating-district/${ratingDistrict}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     if (response) {
  //       setCadastralZones(response.data.data)
  //       fetchProperties();
  //     }

  //   } catch (error) {

  //   }
  // }
  // const fetchStreet = async () => {
  //   try {
  //     const response = await axios.get(`${apiUrl}/api/street/by-cadastral-zone/${cadastralZone}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     if (response) {
  //       setStreets(response.data.data)
  //       fetchProperties();
  //     }

  //   } catch (error) {

  //   }
  // }


  // useEffect(() => {
  //   if (ratingDistrict > 0 && cadastralZone == 0 && street == 0) {
  //     fetchCadastralZone()
  //   }
  //   if (cadastralZone > 0 && street == 0 && ratingDistrict > 0) {
  //     fetchStreet()
  //   }
  //   //fetchProperties()

  // }, [ratingDistrict, propertyUse, cadastralZone, street])



  const handleQueryChange = (event: any) => {
    const query = event.target.value;
    if (query.length >= 1) {
      setSearchButton(true)
    } else {
      setSearchButton(false)
    }
    setSearchQuery(query);
  };


  useEffect(() => {
    fetchProperties()
  }, []);


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

  useEffect(() => {
    // When ratingDistrict changes, reset both cadastralZone and street
    if (ratingDistrict > 0) {
      setCadastralZone(0); // Reset cadastral zone
      setStreet(0); // Reset street
      setCadastralZones([]); // Reset cadastral zone
      setStreets([]); // Reset street
      fetchCadastralZone();
    }
  }, [ratingDistrict]);

  useEffect(() => {
    // When cadastralZone changes, reset the street
    if (cadastralZone > 0) {
      setStreet(0); // Reset street
      setStreets([]); // Reset street
      fetchStreet();
    }
  }, [cadastralZone]);

  useEffect(() => {
    // Fetch properties when any of the main dependencies change
    fetchProperties();
  }, [ratingDistrict, propertyUse, cadastralZone, street]);

  const fetchProperties = async () => {
    setPropertyLoader(true)
    setPropertyInformation([])
    try {
      let data = {
        order: order,
        search: searchQuery.length > 0 ? searchQuery : undefined,
        property_use_id: propertyUse !== 0 ? propertyUse : undefined,
        rating_district_id: ratingDistrict !== 0 ? ratingDistrict : undefined,
        cadastral_zone_id: cadastralZone !== 0 ? cadastralZone : undefined,
        street_id: street !== 0 ? street : undefined,
      };

      const response = await axios.post(`${apiUrl}/api/property`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSearch(data);
      setUrl(response.data.links.next);
      setPropertyInformation(response.data.data);
      setPaginationMeta({ next: response.data.links.next });
      setPropertyLoader(false)
    } catch (error) {
      console.error(error);
      setPropertyLoader(false)
    }
  };

  const fetchCadastralZone = async () => {
    setLoadingCadastralZone(true)
    try {
      const response = await axios.get(
        `${apiUrl}/api/cadastral-zone/by-rating-district/${ratingDistrict}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response) {
        setCadastralZones(response.data.data);
        setLoadingCadastralZone(false)
      }

    } catch (error) {
      console.error(error);
      setLoadingCadastralZone(false)
    }
  };

  const fetchStreet = async () => {
    setLoadingStreet(true)
    try {
      const response = await axios.get(
        `${apiUrl}/api/street/by-cadastral-zone/${cadastralZone}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response) {
        setStreets(response.data.data);
        setLoadingStreet(false)
      }

    } catch (error) {
      console.error(error);
      setLoadingStreet(false)
    }
  };



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

              <div>
                <BsArrowDownUp onClick={switchOrder} className={`${order ? "text-green-500" : "text-red-500"} text-[20px] hover:cursor-pointer`} />
              </div>

              <div
                className="w-[100px] flex items-center justify-between gap-2 pr-1.5 border rounded border-divider-grey text-color-text-two"
                title="Filter by District"
              >
                <select
                  className="w-[100%] hover:cursor-pointer p-2 py-1.5 overflow-y-auto text-xs font-medium rounded outline-none appearance-none font-lexend overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white"
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
              {
                loadingCadastralZone && ratingDistrict > 0 ?
                  <LoadingSpinner title="" />
                  :
                  <div className="flex items-center justify-between gap-2 pr-1.5 ">

                    <div >
                      {cadastralZones.length > 0 ? (
                        <div
                          className="w-[100px] flex items-center justify-between gap-2 pr-1.5 border rounded border-divider-grey text-color-text-two"
                          title="Filter by District"
                        >
                          <select
                            className="w-[100%] hover:cursor-pointer p-2 py-1.5 overflow-y-auto text-xs font-medium rounded outline-none appearance-none font-lexend overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white"
                            onChange={(e: any) => setCadastralZone(e.target.value)}
                            value={cadastralZone}
                          >
                            <option value="0"> Cadastral Zone</option>
                            {cadastralZones.map((cadastralZone: any, index) => (
                              <option key={cadastralZone.id} value={cadastralZone.id}>
                                {cadastralZone.name}
                              </option>
                            ))}
                          </select>
                          <span className="text-xs">
                            <BsCaretDownFill />
                          </span>
                        </div>
                      ) : null
                      }
                    </div>
                    {
                      loadingStreet && cadastralZone > 0 ?
                        <LoadingSpinner title="" />
                        :
                        <div >
                          {streets.length > 0 ? (
                            <div
                              className="w-[100px] flex items-center justify-between gap-2 pr-1.5 border rounded border-divider-grey text-color-text-two"
                              title="Filter by District"
                            >
                              <select
                                className="w-[100%] hover:cursor-pointer p-2 py-1.5 overflow-y-auto text-xs font-medium rounded outline-none appearance-none font-lexend overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white"
                                onChange={(e: any) => setStreet(e.target.value)}
                                value={street}
                              >
                                <option value="0"> Streets</option>
                                {streets.map((street: any, index) => (
                                  <option key={street.id} value={street.id}>
                                    {street.name}
                                  </option>
                                ))}
                              </select>
                              <span className="text-xs">
                                <BsCaretDownFill />
                              </span>
                            </div>
                          ) : null
                          }
                        </div>
                    }
                  </div>

              }

              {/* <div
                className="w-[100px] flex items-center justify-between gap-2 pr-1.5 border rounded border-divider-grey text-color-text-two"
                title="Filter by Property Use"
              >
                <select
                  className="w-[100%] hover:cursor-pointer p-2 py-1.5 overflow-y-auto text-xs font-medium rounded outline-none appearance-none font-lexend overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white"
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
              </div> */}

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
                  ) : !propertyLoader ? (
                    <p className="text-sm font-medium font-lexend text-color-text-black">
                      No results found.
                    </p>
                  )
                    : <LoadingSpinner title="Loading Properties" />
                }
                {preventLoading && propertyInformation.length > 0 && url ? <LoadingSpinner title="Loading More Properties" /> : null}
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