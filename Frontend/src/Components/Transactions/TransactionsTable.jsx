import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { TbCurrencyNaira } from "react-icons/tb";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { TableSearchInput, Pagination } from "../Index";
import {
  formatNumberWithCommas,
  filterRecordsByKeyAndValue,
  ScrollToTop,
} from "../../Utils/client";

export default function TransactionsTable({ customTableData }) {
  const [displaySearchIcon, setDisplaySearchIcon] = useState(true);
  const [activeMenu, setActiveMenu] = useState(1);
  const [query, setQuery] = useState("");
  const [editModal, setEditModal] = useState(null);
  const [displayColumn, setDisplayColumn] = useState(true);

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
      ? currentProperties(customTableData.transactionInformation)
      : activeMenu === 2
      ? currentProperties(
          filterRecordsByKeyAndValue(
            customTableData.transactionInformation,
            "transactionType",
            "Bank Transfer"
          )
        )
      : [];

  const filteredResults = query
    ? customTableData.transactionInformation.filter((record) =>
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

  const recordField = (transactionInformation) => {
    return (
      <div
        key={transactionInformation.id}
        className="flex items-center justify-between gap-1 text-xs"
      >
        <span className="flex flex-wrap items-center justify-center w-2/12 h-10 px-2 py-1 text-sm font-medium rounded text-color-text-three bg-custom-blue-400">
          {transactionInformation.propertyDetails.demandNoticeNumber}
        </span>
        <span className="flex flex-wrap items-center justify-center w-20 p-1 text-xs font-medium rounded text-color-text-black bg-custom-blue-100 border-0.6 border-custom-color-one">
          {transactionInformation.propertyDetails.personalIdentificationNumber}
        </span>
        <span className="flex flex-wrap items-center w-2/12 font-lexend text-color-text-black">
          {transactionInformation.propertyDetails.address}
        </span>
        <span
          className={`flex flex-wrap text-center items-center px-2 py-1 justify-center rounded-xl width-12-percent font-light font-lexend text-color-text-black text-10px border-0.6 border-custom-grey-100
            ${
              transactionInformation.transactionType === "Mobile Transfer"
                ? "bg-color-light-red"
                : "bg-color-light-yellow"
            }`}
        >
          {transactionInformation.transactionType.toUpperCase()}
        </span>
        <span className="flex flex-wrap items-center justify-center text-sm width-12-percent text-color-text-black font-chonburi">
          {formatNumberWithCommas(transactionInformation.propertyDetails.ratePayable)}
        </span>
        <span className="flex flex-wrap items-center justify-center w-1/12 text-color-text-black font-lexend text-10px">
          {transactionInformation.date}
        </span>
        <span className="flex flex-wrap items-center justify-center gap-1 width-12-percent">
          <span className="border-0.6 relative border-custom-grey-100 text-custom-grey-300 px-2 py-2.5 rounded text-base hover:cursor-pointer">
            <span
              title="Edit Transaction"
              className="hover:cursor-pointer"
              onClick={() => handleEditModal(transactionInformation.id)}
            >
              <HiOutlineDotsHorizontal />
            </span>
            {editModal === transactionInformation.id && (
              <span className="absolute space-y-2 top-0 z-10 flex-col w-36 p-4 text-xs text-center bg-white rounded shadow-md -left-44 border-0.6 border-custom-grey-100 text-color-text-black font-lexend">
                <p className="hover:cursor-pointer" title="Edit Transaction">
                  View Transaction
                </p>
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
        : customTableData.transactionInformation.length
      : filterRecordsByKeyAndValue(
          customTableData.transactionInformation,
          "transactionType",
          "Bank Transfer"
        ).length;
  }

  return (
    <div
      id="top-container"
      className="flex-col space-y-4 p-4 border-0.6 border-custom-grey-100 rounded-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center justify-between border-0.6 border-custom-grey-100 rounded p-1">
          {customTableData.staticInformation.transactions.menu.map((menu) =>
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
                      : customTableData.transactionInformation.length
                    : filterRecordsByKeyAndValue(
                        customTableData.transactionInformation,
                        "transactionType",
                        "Bank Transfer"
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
          {customTableData.staticInformation.transactions.columns.map((column) => (
            <div
              key={column.id}
              className={`flex items-center gap-1 w-1/12 text-color-text-two text-10px font-lexend
              ${[1, 3].includes(column.id) && "w-2/12"}
              ${[2].includes(column.id) && "w-20"}
              ${[4, 5, 7].includes(column.id) && "width-12-percent"}
              ${column.id === 6 && "w-1/12"}
              ${[5, 6, 7].includes(column.id) && "justify-center"}
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
          of <span id="length">{LengthByActiveMenu()}</span>
          entries
        </p>
      </div>
    </div>
  );
}