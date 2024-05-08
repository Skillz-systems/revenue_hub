import React, { useState } from "react";
import { SearchInput } from "../Index";
import { FiSearch } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { TbCurrencyNaira } from "react-icons/tb";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { TableSearchInput } from "../Index";

export default function DemandInvoiceTable({ customTableData }) {
  const [displaySearchIcon, setDisplaySearchIcon] = useState(true);
  const [activeMenu, setActiveMenu] = useState(1);
  const [query, setQuery] = useState("");

  function formatNumberWithCommas(number) {
    // Convert the number to a string
    const numStr = String(number);

    // Split the string into integer and decimal parts (if any)
    const [integerPart, decimalPart] = numStr.split(".");

    // Add commas to the integer part
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Combine the integer and decimal parts (if any)
    const formattedNumber = decimalPart
      ? `${formattedInteger}.${decimalPart}`
      : formattedInteger;

    return formattedNumber;
  }

  function filterRecordsByPaymentStatus(records, status) {
    return records.filter((record) => record.paymentStatus === status);
  }

  const filteredRecords =
    activeMenu === 1
      ? customTableData.records
      : activeMenu === 2
      ? filterRecordsByPaymentStatus(customTableData.records, "Paid")
      : activeMenu === 3
      ? filterRecordsByPaymentStatus(customTableData.records, "Unpaid")
      : activeMenu === 4
      ? filterRecordsByPaymentStatus(customTableData.records, "Expired")
      : [];

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const filteredResults = query
    ? customTableData.records.filter((record) =>
        Object.values(record).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(query.toLowerCase())
        )
      )
    : [];

  const recordField = (record) => {
    return (
      <div
        key={record.id}
        className="flex items-center justify-between gap-1 text-xs"
      >
        <span className="flex flex-wrap items-center justify-center w-24 h-10 px-2 py-1 text-sm font-medium rounded text-color-text-three bg-custom-blue-400">
          {record.pin}
        </span>
        <span className="flex flex-wrap items-center w-2/12 font-lexend text-color-text-black">
          {record.address}
        </span>
        <span className="flex flex-wrap items-center width-5-percent text-color-text-black font-lexend text-10px">
          {record.date}
        </span>
        <span
          className={`flex flex-wrap items-center px-4 py-1 justify-center rounded-xl width-12-percent font-light font-lexend text-color-text-black text-10px border-0.6 border-custom-grey-100
        ${
          record.propertyUse === "Commercial"
            ? "bg-color-light-red"
            : record.propertyUse === "Residential"
            ? "bg-color-light-yellow"
            : "bg-custom-blue-200"
        }
        `}
        >
          {record.propertyUse.toUpperCase()}
        </span>
        <span className="flex flex-wrap items-center justify-center p-1 font-light rounded width-12-percent font-lexend text-custom-blue-500 bg-custom-blue-100 border-0.6 border-custom-grey-100">
          {record.cadestralZone}
        </span>
        <span className="flex flex-wrap items-center justify-center text-sm width-12-percent text-color-text-black font-chonburi">
          {formatNumberWithCommas(record.ratePayable)}
        </span>
        <span
          className={`flex flex-wrap items-center justify-center width-12-percent p-1 font-light text-white rounded font-lexend
        ${
          record.paymentStatus === "Expired"
            ? "bg-color-bright-red"
            : record.paymentStatus === "Unpaid"
            ? "bg-color-bright-orange"
            : "bg-color-bright-green"
        }
        `}
        >
          {record.paymentStatus}
        </span>
        <span className="flex flex-wrap items-center w-1/12 gap-1 ">
          <span
            className="border-0.6 border-custom-grey-100 text-custom-grey-300 px-2 py-2.5 rounded text-base hover:cursor-pointer"
            title="Delete Invoice"
          >
            <RiDeleteBin5Fill />
          </span>
          <span
            className="border-0.6 border-custom-grey-100 text-custom-grey-300 px-2 py-2.5 rounded text-base hover:cursor-pointer"
            title="Edit Invoice"
          >
            <HiOutlineDotsHorizontal />
          </span>
        </span>
      </div>
    );
  };
  return (
    <div className="flex-col space-y-4 p-4 border-0.6 border-custom-grey-100 rounded-lg">
      <div className="flex flex-wrap items-start justify-between ">
        <div className="flex items-center justify-between border-0.6 border-custom-grey-100 rounded p-1">
          {customTableData.menu.map((menu) => (
            <div
              key={menu.id}
              className={`flex items-start justify-between gap-2 px-2 py-1 text-xs font-lexend hover:cursor-pointer ${
                activeMenu === menu.id
                  ? "bg-primary-color rounded"
                  : "bg-inherit"
              }`}
              onClick={() => {
                setActiveMenu(menu.id);
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
                {menu.count}
              </span>
            </div>
          ))}
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
          {customTableData.columns.map((column) => (
            <div
              key={column.id}
              className={`flex items-center gap-1 w-1/12 text-color-text-two text-10px font-lexend
              ${column.id === 1 && "w-24"}
              ${column.id === 2 && "w-2/12"}
              ${column.id === 3 && "width-5-percent"}
              ${[4, 5, 6, 7].includes(column.id) && "width-12-percent"}
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
      <div>
        <b className="p-1 text-sm ">PAGINATION COMPONENT</b>
      </div>
    </div>
  );
}
