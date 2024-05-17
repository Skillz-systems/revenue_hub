import React, { useState, useEffect } from "react";
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
} from "../Index";
import {
  formatNumberWithCommas,
  filterRecordsByKeyAndValue,
  ScrollToTop,
} from "../../Utils/client";

export default function DemandInvoiceTable({ customTableData }) {
  const [displaySearchIcon, setDisplaySearchIcon] = useState(true);
  const [activeMenu, setActiveMenu] = useState(1);
  const [query, setQuery] = useState("");
  const [editModal, setEditModal] = useState(null);
  const [displayColumn, setDisplayColumn] = useState(true);
  const [viewPropertyModal, setViewPropertyModal] = useState(null);
  const [propertyModalTransition, setPropertyModalTransition] = useState(false);

  const handleViewPropertyModal = (propertyData) => {
    setViewPropertyModal(propertyData);
    setTimeout(() => {
      setPropertyModalTransition(true);
    }, 250);
  };

  // PAGINATION LOGIC
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
    setCurrentPage(0);
    ScrollToTop("top-container");
  };

  const currentProperties = (data) => {
    return data.slice(offset, offset + propertiesPerPage);
  };

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
    pageClassName: `flex items-center justify-center w-[32px] h-[32px] px-2.5 border border-divider-grey rounded`,
    pageLinkClassName: "text-sm text-color-text-two font-mulish",
    breakLabel: <HiOutlineDotsHorizontal />,
    breakClassName:
      "flex items-center justify-center h-[32px] px-2 border border-divider-grey rounded",
    breakLinkClassName: "text-base text-color-text-two font-mulish",
  };

  const handleEditModal = (recordId) => {
    setEditModal(editModal === recordId ? null : recordId);
  };

  useEffect(() => {
    setActiveMenu(1);
    setDisplayColumn(false);
  }, [query !== ""]);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const filteredRecords =
    activeMenu === 1
      ? currentProperties(customTableData.demandNoticeInformation)
      : activeMenu === 2
      ? currentProperties(
          filterRecordsByKeyAndValue(
            customTableData.demandNoticeInformation,
            "paymentStatus",
            "Paid"
          )
        )
      : activeMenu === 3
      ? currentProperties(
          filterRecordsByKeyAndValue(
            customTableData.demandNoticeInformation,
            "paymentStatus",
            "Unpaid"
          )
        )
      : activeMenu === 4
      ? currentProperties(
          filterRecordsByKeyAndValue(
            customTableData.demandNoticeInformation,
            "paymentStatus",
            "Expired"
          )
        )
      : [];

  const filteredResults = query
    ? customTableData.demandNoticeInformation.filter((record) =>
        Object.values(record).some((value) => {
          if (typeof value === "string") {
            // For string values, perform case-insensitive comparison
            return value.toLowerCase().includes(query.toLowerCase());
          } else if (typeof value === "number" || Number.isInteger(value)) {
            // For numeric values, stringify and compare
            return String(value).toLowerCase().includes(query.toLowerCase());
          }
          return false; // Ignore other data types
        })
      )
    : [];

  const pageCount = Math.ceil(LengthByActiveMenu() / propertiesPerPage);

  const recordField = (demandNoticeInformation) => {
    return (
      <div
        key={demandNoticeInformation.id}
        className="flex items-center justify-between gap-1 text-xs"
      >
        <span className="flex flex-wrap items-center justify-center w-24 h-10 px-2 py-1 text-sm font-medium rounded text-color-text-three bg-custom-blue-400">
          {demandNoticeInformation.personalIdentificationNumber}
        </span>
        <span className="flex flex-wrap items-center w-2/12 font-lexend text-color-text-black">
          {demandNoticeInformation.propertyAddress}
        </span>
        <span className="flex flex-wrap items-center width-5-percent text-color-text-black font-lexend text-10px">
          {
            demandNoticeInformation.demandInvoiceData[
              demandNoticeInformation.demandInvoiceData.length - 1
            ].dateCreated
          }
        </span>
        <span
          className={`flex flex-wrap items-center px-4 py-1 justify-center rounded-xl width-12-percent font-light font-lexend text-color-text-black text-10px border-0.6 border-custom-grey-100
        ${
          demandNoticeInformation.propertyUse === "Commercial"
            ? "bg-color-light-red"
            : demandNoticeInformation.propertyUse === "Residential"
            ? "bg-color-light-yellow"
            : "bg-custom-blue-200"
        }
        `}
        >
          {demandNoticeInformation.propertyUse.toUpperCase()}
        </span>
        <span className="flex flex-wrap items-center justify-center p-1 font-light rounded width-12-percent font-lexend text-custom-blue-500 bg-custom-blue-100 border-0.6 border-custom-grey-100">
          {demandNoticeInformation.cadestralZone}
        </span>
        <span className="flex flex-wrap items-center justify-center text-sm width-12-percent text-color-text-black font-chonburi">
          {formatNumberWithCommas(demandNoticeInformation.ratePayable)}
        </span>
        <div className="flex items-center justify-center width-12-percent">
          <span
            className={`flex flex-wrap items-center justify-center px-2 p-1 font-light text-white rounded font-lexend
          ${
            demandNoticeInformation.paymentStatus === "Expired"
              ? "bg-color-bright-red"
              : demandNoticeInformation.paymentStatus === "Unpaid"
              ? "bg-color-bright-orange"
              : "bg-color-bright-green"
          }
          `}
          >
            {demandNoticeInformation.paymentStatus}
          </span>
        </div>
        <span className="flex flex-wrap items-center w-1/12 gap-1 ">
          <span
            className="border-0.6 border-custom-grey-100 text-custom-grey-300 px-2 py-2.5 rounded text-base hover:cursor-pointer"
            title="Delete Invoice"
          >
            <RiDeleteBin5Fill />
          </span>
          <span className="border-0.6 relative border-custom-grey-100 text-custom-grey-300 px-2 py-2.5 rounded text-base">
            <span
              title="Edit Invoice"
              className="hover:cursor-pointer"
              onClick={() => handleEditModal(demandNoticeInformation.id)}
            >
              <HiOutlineDotsHorizontal />
            </span>
            {editModal === demandNoticeInformation.id && (
              <span className="absolute space-y-2 top-0 z-10 flex-col w-40 p-4 text-xs bg-white rounded shadow-md -left-44 border-0.6 border-custom-grey-100 text-color-text-black font-lexend">
                <p className="hover:cursor-pointer" title="View Demand Notice">
                  View Demand Notice
                </p>
                <p
                  className="hover:cursor-pointer"
                  title="View Property"
                  onClick={() =>
                    handleViewPropertyModal(demandNoticeInformation)
                  }
                >
                  View Property
                </p>
                {demandNoticeInformation.paymentStatus === "Expired" ? (
                  <p className="hover:cursor-pointer" title="Generate Reminder">
                    Generate Reminder
                  </p>
                ) : demandNoticeInformation.paymentStatus === "Unpaid" ? (
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
    return activeMenu === 1
      ? filteredResults.length > 0
        ? filteredResults.length
        : filteredResults < 1 && query != ""
        ? 0
        : customTableData.demandNoticeInformation.length
      : activeMenu === 2
      ? filterRecordsByKeyAndValue(
          customTableData.demandNoticeInformation,
          "paymentStatus",
          "Paid"
        ).length
      : activeMenu === 3
      ? filterRecordsByKeyAndValue(
          customTableData.demandNoticeInformation,
          "paymentStatus",
          "Unpaid"
        ).length
      : filterRecordsByKeyAndValue(
          customTableData.demandNoticeInformation,
          "paymentStatus",
          "Expired"
        ).length;
  }

  return (
    <div>
      <div
        id="top-container"
        className="flex-col space-y-4 p-4 border-0.6 border-custom-grey-100 rounded-lg"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center justify-between border-0.6 border-custom-grey-100 rounded p-1">
            {customTableData.staticInformation.demandNotice.menu.map((menu) =>
              displayColumn === false && query !== "" && menu.id > 1 ? null : (
                <div
                  key={menu.id}
                  className={`flex items-start justify-between gap-2 px-2 py-1 text-xs font-lexend hover:cursor-pointer ${
                    activeMenu === menu.id
                      ? "bg-primary-color rounded"
                      : "bg-inherit"
                  }`}
                  onClick={() => {
                    setActiveMenu(menu.id);
                    setCurrentPage(0);
                    setCurrentStyle(0);
                  }}
                >
                  <span
                    className={`${
                      activeMenu === menu.id
                        ? "font-medium text-white"
                        : "text-color-text-two"
                    }`}
                  >
                    {menu.name}
                  </span>
                  <span className="px-1 border rounded text-color-text-three bg-custom-blue-200 border-custom-color-two">
                    {menu.id === 1
                      ? filteredResults.length > 0
                        ? filteredResults.length
                        : filteredResults < 1 && query != ""
                        ? 0
                        : customTableData.demandNoticeInformation.length
                      : menu.id === 2
                      ? filterRecordsByKeyAndValue(
                          customTableData.demandNoticeInformation,
                          "paymentStatus",
                          "Paid"
                        ).length
                      : menu.id === 3
                      ? filterRecordsByKeyAndValue(
                          customTableData.demandNoticeInformation,
                          "paymentStatus",
                          "Unpaid"
                        ).length
                      : filterRecordsByKeyAndValue(
                          customTableData.demandNoticeInformation,
                          "paymentStatus",
                          "Expired"
                        ).length}
                  </span>
                </div>
              )
            )}
          </div>
          <TableSearchInput
            parentBoxStyle="flex items-center justify-between p-2 bg-custom-grey-100 rounded-3xl border border-custom-color-one"
            inputBoxStyle={` ${
              displaySearchIcon ? "w-10/12" : "w-full"
            } text-xs outline-none bg-inherit font-lexend text-color-text-two`}
            iconBoxStyle={"text-base text-primary-color hover:cursor-pointer"}
            placeholder={"Search records"}
            searchIcon={<FiSearch />}
            handleOnInput={(event) => {
              event.preventDefault();
              if (event.target.value) {
                setDisplaySearchIcon(false);
              } else {
                setDisplaySearchIcon(true);
              }
            }}
            displaySearchIcon={displaySearchIcon}
            query={query}
            handleQueryChange={handleQueryChange}
          />
        </div>

        <div className="flex-col space-y-6 ">
          <div className="flex items-center justify-between gap-1">
            {customTableData.staticInformation.demandNotice.columns.map(
              (column) => (
                <div
                  key={column.id}
                  className={`flex items-center gap-1 w-1/12 text-color-text-two text-10px font-lexend
            ${column.id === 1 && "w-24"}
            ${column.id === 2 && "w-2/12"}
            ${column.id === 3 && "width-5-percent"}
            ${[4, 5, 6, 7].includes(column.id) && "width-12-percent"}
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
              )
            )}
          </div>
          <div className="flex-col space-y-4">
            {query === "" ? (
              filteredRecords.length > 0 ? (
                filteredRecords.map((record) => recordField(record))
              ) : (
                <p className="text-sm font-medium font-lexend text-color-text-black">
                  No results found.
                </p>
              )
            ) : filteredResults.length > 0 ? (
              filteredResults.map((record) => recordField(record))
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
                LengthByActiveMenu() > propertiesPerPage
                  ? propertiesPerPage
                  : LengthByActiveMenu()
              }
            >
              {Array.from({ length: LengthByActiveMenu() }, (_, index) => (
                <option key={index} value={1 + index}>
                  {1 + index}
                </option>
              ))}
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
    </div>
  );
}