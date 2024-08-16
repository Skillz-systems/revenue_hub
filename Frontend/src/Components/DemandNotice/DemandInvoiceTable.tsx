import React, { useState, useEffect, ChangeEvent } from "react";
import { useMediaQuery } from "react-responsive";
import { FiSearch } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { TbCurrencyNaira } from "react-icons/tb";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import {
  TableSearchInput,
  Pagination,
  DemandPropertyModal,
  ViewPropertyModal,
  DemandInvoiceDocument,
  CustomAlert,
  paginationStyles,
} from "../Index";
import { DemandNotice } from "../../Data/types";
import {
  formatNumberWithCommas,
  formatDate,
  ScrollToTop,
  useTokens,
  useTriggerError,
} from "../../Utils/client";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL as string;

const DemandInvoiceTable = ({
  staticInformation,
  demandNoticeInformation,
  paginationMeta,
  setPaginationMeta,
}: {
  staticInformation: any;
  demandNoticeInformation: DemandNotice[];
  paginationMeta: {
    currentPage: number;
    lastPage: number;
    total: number;
    perPage: number;
  };
  setPaginationMeta: React.SetStateAction<any>;
}) => {
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
  const [displaySearchIcon, setDisplaySearchIcon] = useState<boolean>(true);
  const [activeMenu, setActiveMenu] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [editModal, setEditModal] = useState<number | null>(null);
  const [displayColumn, setDisplayColumn] = useState<boolean>(true);
  const [viewPropertyModal, setViewPropertyModal] = useState<any>(null);
  const [propertyModalTransition, setPropertyModalTransition] =
    useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [currentStyle, setCurrentStyle] = useState<number | undefined>(
    undefined
  );
  const [demandInvoiceDocument, setDemandInvoiceDocument] = useState<any>(null);
  const { token, userRoleId } = useTokens();
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

  const deleteDemandNotice = async (id: number) => {
    if (userRoleId > 1) {
      setSnackbar({
        open: true,
        message: "You don't have permission",
        severity: "error",
      });
      return;
    }

    try {
      const response = await axios.delete(
        `${apiUrl}/api/demand-notice/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Headers
          },
        }
      );
      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: "Successfully removed demand notice",
          severity: "success",
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setSnackbar({
          open: true,
          message: "Unexpected status code",
          severity: "warning",
        });
      }
    } catch (error: any) {
      let message = "Internal Server Error";
      if (error.response) {
        switch (error.response.status) {
          case 400:
            message = "Bad request. Demand Notice Id is missing.";
            break;
          case 401:
            message = "You are unauthorized";
            break;
          case 403:
            message = "You are forbidden";
            break;
          case 404:
            message = "Demand notice not found";
            break;
          case 429:
            message = "Too many requests made. Refreshing in 3 seconds";
            setTimeout(() => {
              window.location.reload();
            }, 3000);
            break;
          case 500:
            triggerError(error);
            break;
          default:
            break;
        }
      }
      setSnackbar({ open: true, message, severity: "error" });
    }
  };

  const handleViewPropertyModal = (propertyData: any) => {
    setViewPropertyModal(propertyData);
    setTimeout(() => {
      setPropertyModalTransition(true);
    }, 250);
  };

  const handleViewDemandInvoiceModal = (propertyData: any) => {
    setDemandInvoiceDocument(propertyData);
  };

  // PAGINATION LOGIC
  const offset = currentPage * propertiesPerPage;

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPaginationMeta((prev: any) => ({
      ...prev,
      currentPage: selected + 1, // SWR uses 1-based index for pages
    }));
    ScrollToTop("top-container");
  };

  const handlePropertiesPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    ScrollToTop("top-container");
  };

  const currentProperties = (data: any) => {
    if (!data) {
      return [];
    }
    console.log("Demand Notice", data)
    return data?.slice(offset, offset + propertiesPerPage);
  };

  const handleEditModal = (recordId: number) => {
    setEditModal(editModal === recordId ? null : recordId);
  };

  useEffect(() => {
    setActiveMenu(1);
    setDisplayColumn(false);
  }, [query !== ""]);

  const handleQueryChange = (event: any) => {
    setQuery(event.target.value);
  };

  const pageCount = Math.ceil(LengthByActiveMenu() / propertiesPerPage);

  const recordField = (record: DemandNotice) => {
    const lastPaymentStatus = record?.property?.demand_notice_status;
    function getRandomStatus() {
      return Math.floor(Math.random() * 5);
    }
    function getStatusClass(status) {

      switch (status) {
        case 0:
          return "bg-black text-white";
        case 1:
          return "bg-black-500 text-white";
        case 2:
          return "bg-Amber-500 text-white";
        case 3:
          return "bg-green-500 text-black";
        case 4:
          return "bg-red-500 text-white";
        default:
          return "bg-gray-100 text-black";
      }
    }
   
    const status = getRandomStatus();

    const className = getStatusClass(status);
    

    return (
      <div
        key={record?.id}
        className="flex items-center justify-between gap-1 text-xs"
      >
        <span className="flex flex-wrap items-center justify-center w-24 h-10 px-2 py-1 text-sm font-medium rounded text-color-text-three bg-custom-blue-400">
          {record?.property?.pid}
        </span>
        <span className="flex flex-wrap items-center w-2/12 font-lexend text-color-text-black">
          {record?.property?.prop_addr}
        </span>
        <span className="flex flex-wrap items-center w-[5%] text-color-text-black font-lexend text-[10px]">
          {formatDate(record?.date_created)}
        </span>
        <span
          className={`flex flex-wrap items-center px-4 py-1 justify-center rounded-xl w-[12%] font-light font-lexend text-color-text-black text-[10px] border-0.6 border-custom-grey-100
          ${record?.property?.prop_use === "Commercial"
              ? "bg-color-light-red"
              : record?.property?.prop_use === "Residential"
                ? "bg-color-light-yellow"
                : "bg-custom-blue-200"
            }
          `}
        >
          {record?.property?.prop_use.toUpperCase()}
        </span>
        <span className="flex flex-wrap items-center justify-center p-1 font-light rounded w-[12%] font-lexend text-custom-blue-500 bg-custom-blue-100 border-0.6 border-custom-grey-100">
          {record?.property?.cadastral_zone}
        </span>
        <span className="flex flex-wrap items-center justify-center text-sm w-[12%] text-color-text-black font-chonburi">
          {formatNumberWithCommas(record?.amount)}
        </span>
        <div className="flex items-center justify-center w-[12%]">
          <span
            className={`flex flex-wrap items-center justify-center px-2 p-1 font-light text-white rounded font-lexend
            ${
              className
            }
            `}
          >
            {lastPaymentStatus}
          </span>
        </div>
        <span className="flex flex-wrap items-center w-1/12 gap-1">
          <span
            className="border-0.6 border-custom-grey-100 text-custom-grey-300 px-2 py-2.5 rounded text-base hover:cursor-pointer"
            title="Delete Invoice"
            onClick={() => deleteDemandNotice(record?.id)}
          >
            <RiDeleteBin5Fill />
          </span>
          <span className="border-0.6 relative border-custom-grey-100 text-custom-grey-300 px-2 py-2.5 rounded text-base">
            <span
              title="Edit Invoice"
              className="hover:cursor-pointer"
              onClick={() => handleEditModal(record?.id)}
            >
              <HiOutlineDotsHorizontal />
            </span>
            {editModal === record?.id && (
              <span
                className="absolute space-y-2 top-0 z-10 flex-col w-40 p-4 text-xs bg-white rounded shadow-md -left-44 border-0.6 border-custom-grey-100 text-color-text-black font-lexend"
                onMouseLeave={() => setEditModal(null)}
              >
                <p
                  className="hover:cursor-pointer"
                  title="View Demand Notice"
                  onClick={() => handleViewDemandInvoiceModal(record)}
                >
                  View Demand Notice
                </p>
                <p
                  className="hover:cursor-pointer"
                  title="View Property"
                  onClick={() => handleViewPropertyModal(record)}
                >
                  View Property
                </p>
                {lastPaymentStatus === "Expired" ? (
                  <p
                    className="hover:cursor-pointer"
                    title="Generate Reminder"
                    onClick={() => {
                      if (userRoleId > 1) {
                        setSnackbar({
                          open: true,
                          message: "You don't have permission",
                          severity: "error",
                        });
                        return;
                      }
                    }}
                  >
                    Generate Reminder
                  </p>
                ) : lastPaymentStatus === "Unpaid" ? (
                  <p className="hover:cursor-pointer" title="View Reminder">
                    View Reminder
                  </p>
                ) : null}
              </span>
            )}
          </span>
        </span>
      </div>
    );
  };

  function LengthByActiveMenu() {
    return paginationMeta.total;
  }

  return (
    <div className="w-[1000px] lg:w-full">
      <div
        id="top-container"
        className="flex-col space-y-4 p-4 border-0.6 border-custom-grey-100 rounded-lg"
      >
        {!isDesktop ? (
          <p className="text-base font-bold text-color-text-two lg:hidden">
            DEMAND NOTICES
          </p>
        ) : null}
        <div className="flex items-start justify-between">
          <div className="flex items-center justify-between border-0.6 border-custom-grey-100 rounded p-1">
            {staticInformation.demandNotice.menu.map((menu: any) =>
              displayColumn === false && query !== "" && menu.id > 1 ? null : (
                <div
                  key={menu.id}
                  className={`flex items-start justify-between gap-2 px-2 py-1 text-xs font-lexend hover:cursor-pointer ${activeMenu === menu.id
                      ? "bg-primary-color rounded"
                      : "bg-inherit"
                    }`}
                  onClick={() => {
                    if (menu.id > 1) {
                      setSnackbar({
                        open: true,
                        message: "Disabled Feature. Coming soon.",
                        severity: "warning",
                      });
                    } else {
                      setActiveMenu(menu.id);
                    }
                    setCurrentPage(0);
                    setCurrentStyle(0);
                  }}
                >
                  <span
                    className={`${activeMenu === menu.id
                        ? "font-medium text-white"
                        : "text-color-text-two"
                      }`}
                  >
                    {menu.name}
                  </span>
                  {menu.id === 1 ? (
                    <span className="px-1 border rounded text-color-text-three bg-custom-blue-200 border-custom-color-two">
                      {menu.id === 1 ? demandNoticeInformation.length : 0}
                    </span>
                  ) : null}
                </div>
              )
            )}
          </div>
          <TableSearchInput
            parentBoxStyle="flex items-center justify-between p-2 bg-custom-grey-100 rounded-3xl border border-custom-color-one"
            inputBoxStyle={` ${displaySearchIcon ? "w-10/12" : "w-full"
              } text-xs outline-none bg-inherit font-lexend text-color-text-two`}
            iconBoxStyle={"text-base text-primary-color hover:cursor-pointer"}
            placeholder={"Search records"}
            searchIcon={<FiSearch />}
            handleOnInput={(event) => {
              event.preventDefault();
              if ((event.target as HTMLInputElement).value) {
                setDisplaySearchIcon(false);
              } else {
                setDisplaySearchIcon(true);
              }
            }}
            displaySearchIcon={displaySearchIcon}
            query={query}
            handleQueryChange={handleQueryChange}
            setSnackBar={setSnackbar}
          />
        </div>

        <div className="flex-col space-y-6 ">
          <div className="flex items-center justify-between gap-1">
            {staticInformation.demandNotice.columns.map((column: any) => (
              <div
                key={column.id}
                className={`flex items-center gap-1 w-1/12 text-color-text-two text-[10px] font-lexend
            ${column.id === 1 && "w-24"}
            ${column.id === 2 && "w-2/12"}
            ${column.id === 3 && "width-5-percent"}
            ${[4, 5, 6, 7].includes(column.id) && "w-[12%]"}
            ${[6, 7].includes(column.id) && "justify-center"}
            `}
              >
                <GoDotFill />
                <span className="flex items-center justify-center gap-1">
                  {column.name}
                  {column.name === "RATE PAYABLE" ? (
                    <span className="text-base text-color-bright-green">
                      <TbCurrencyNaira />
                    </span>
                  ) : null}
                </span>
              </div>
            ))}
          </div>
          <div className="flex-col space-y-4">
            {query === "" ? (
              // FILTER BY QUERY
              demandNoticeInformation.length > 0 ? (
                currentProperties(demandNoticeInformation).map(
                  (record: DemandNotice) => recordField(record)
                )
              ) : (
                <p className="text-sm font-medium font-lexend text-color-text-black">
                  No results found.
                </p>
              )
            ) : demandNoticeInformation.length > 0 ? (
              // FILTER EVERYTHING ELSE
              currentProperties(demandNoticeInformation).map((record: any) =>
                recordField(record)
              )
            ) : (
              <p className="text-sm font-medium font-lexend text-color-text-black">
                No results found.
              </p>
            )}
          </div>
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
            of <span>{LengthByActiveMenu()}</span>
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
      {demandInvoiceDocument ? (
        <DemandPropertyModal
          modalStyle={
            "absolute top-0 left-0 z-[30] flex items-start justify-end w-full h-screen p-4 overflow-hidden bg-black bg-opacity-60"
          }
        >
          <DemandInvoiceDocument
            hideDemandInvoiceModal={() => {
              setDemandInvoiceDocument(false);
              // setTimeout(() => {
              //   setPropertyModalTransition(false);
              // }, 300);
            }}
            // propertyModalTransition={propertyModalTransition}
            demandInvoiceInfo={demandInvoiceDocument}
          />
        </DemandPropertyModal>
      ) : null}
      <CustomAlert
        isOpen={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        handleClose={handleSnackbarClose}
      />
    </div>
  );
};

export default DemandInvoiceTable;
