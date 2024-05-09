import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { HiUsers } from "react-icons/hi2";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { TableSearchInput } from "../Index";
import { filterRecordsByKeyAndValue } from "../../Utils/client";

export default function TransactionsTable({ customTableData }) {
  const [displaySearchIcon, setDisplaySearchIcon] = useState(true);
  const [activeMenu, setActiveMenu] = useState(1);
  const [query, setQuery] = useState("");
  const [editModal, setEditModal] = useState(null);
  const [displayColumn, setDisplayColumn] = useState(true);

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
      ? customTableData.records
      : activeMenu === 2
      ? filterRecordsByKeyAndValue(customTableData.records, "type", "Manager")
      : activeMenu === 3
      ? filterRecordsByKeyAndValue(customTableData.records, "type", "Officer")
      : [];

  const filteredResults = query
    ? customTableData.records.filter((record) =>
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

  const recordField = (record) => {
    return (
      <div
        key={record.id}
        className="flex items-center justify-between gap-1 text-xs"
      >
        <span className="flex flex-wrap items-center justify-center h-10 px-2 py-1 text-sm font-medium rounded width-12-percent text-color-text-three bg-custom-blue-400">
          {record.staffId}
        </span>
        <span className="flex flex-wrap items-center w-40 text-sm font-bold rounded font-lexend text-color-text-black">
          {record.fullName}
        </span>
        <span className="flex flex-wrap items-center w-2/12 text-xs font-lexend text-color-text-black">
          {record.email}
        </span>
        <span className="flex flex-wrap items-center justify-center w-2/12 text-xs font-lexend text-color-text-black">
          {record.phoneNumber}
        </span>
        <span
          className={`flex flex-wrap text-center items-center px-2 py-1 justify-center rounded-xl w-1/12 font-light font-lexend text-color-text-black text-10px border-0.6 border-custom-grey-100
            ${
              record.type === "Manager"
                ? "bg-color-light-red"
                : "bg-color-light-yellow"
            }`}
        >
          {record.type.toUpperCase()}
        </span>
        <span className="flex flex-wrap items-center justify-center w-1/12 gap-1">
          <span className="border-0.6 relative border-custom-grey-100 text-custom-grey-300 px-2 py-2.5 rounded text-base hover:cursor-pointer">
            <span
              title="Edit Transaction"
              className="hover:cursor-pointer"
              onClick={() => handleEditModal(record.id)}
            >
              <HiOutlineDotsHorizontal />
            </span>
            {editModal === record.id && (
              <span className="absolute space-y-2 top-0 z-10 flex-col w-36 p-4 text-xs bg-white rounded shadow-md -left-44 border-0.6 border-custom-grey-100 text-color-text-black font-lexend">
                <p className="hover:cursor-pointer" title="View Staff Details">
                  View Staff Details
                </p>
                <p className="hover:cursor-pointer" title="Remove Staff">
                  Remove Staff
                </p>
              </span>
            )}
          </span>
        </span>
      </div>
    );
  };
  return (
    <div className="flex-col space-y-4 p-4 border-0.6 border-custom-grey-100 rounded-lg">
      <div className="flex items-start justify-between ">
        <div className="flex items-center justify-between border-0.6 border-custom-grey-100 rounded p-1">
          {customTableData.menu.map((menu) =>
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
                      : customTableData.records.length
                    : menu.id === 2
                    ? filterRecordsByKeyAndValue(
                        customTableData.records,
                        "type",
                        "Manager"
                      ).length
                    : filterRecordsByKeyAndValue(
                        customTableData.records,
                        "type",
                        "Officer"
                      ).length}
                </span>
              </div>
            )
          )}
        </div>
        <div className="flex items-center justify-between gap-4">
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
          <button
            type="button"
            className="flex items-center justify-between p-2 space-x-1 border rounded button-gradient-one border-custom-color-two shadow-custom-100"
            style={{ width: "35%" }}
            title="New Staff"
            onClick={() => {
              alert("Add Staff");
            }}
          >
            <span className="text-sm text-white">
              <HiUsers />
            </span>
            <span
              className="font-medium text-left text-white ellipsis font-lexend"
              style={{ fontSize: "0.6875rem" }}
            >
              New Staff
            </span>
          </button>
        </div>
      </div>

      <div className="flex-col space-y-6">
        <div className="flex items-center justify-between gap-1">
          {customTableData.columns.map((column) => (
            <div
              key={column.id}
              className={`flex items-center gap-1 w-1/12 text-color-text-two text-10px font-lexend
              ${column.id === 1 && "width-12-percent"}
              ${column.id === 2 && "w-40"}
              ${[3, 4].includes(column.id) && "w-2/12"}
              ${column.id === 4 && "justify-center"}
              ${[5, 6].includes(column.id) && "w-1/12 justify-center"}
              `}
            >
              <GoDotFill />
              <span className="flex items-center justify-center gap-1">
                {column.name}
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
