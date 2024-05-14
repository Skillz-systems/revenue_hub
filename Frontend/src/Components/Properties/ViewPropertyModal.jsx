import React, { useState } from "react";
import { MdCancel } from "react-icons/md";
import { BiSolidEditAlt } from "react-icons/bi";
import { PiBuildingsFill } from "react-icons/pi";
import { GiStarFormation } from "react-icons/gi";
import { TbCurrencyNaira } from "react-icons/tb";
import { BsCalendar2EventFill } from "react-icons/bs";
import { formatNumberWithCommas } from "../../Utils/client";

export default function ViewPropertyModal({
  hideViewPropertyModal,
  propertyModalTransition,
  customTableData,
}) {
  const [activateState, setActiveState] = useState(0);
  console.log("MODAL DATA:", customTableData);
  return (
    <>
      <div
        className={`flex-col relative bg-white rounded overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white ${
          propertyModalTransition
            ? "w-5/12 transition-all ease-in-out duration-500"
            : "w-32"
        }`}
        style={{ height: "95vh" }}
      >
        <img
          src={"/lightCheckeredBackgroundPattern.png"}
          alt="Checkered Background"
          className="absolute top-0 left-0 z-0 w-1/2"
        />
        <div className="absolute z-10 flex-col w-full p-4 space-y-16 ">
          <div
            className="flex items-start justify-between"
            style={{ height: "10vh" }}
          >
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-color-text-two">PIN</h3>
              <p className="font-bold text-color-text-one">
                {customTableData.pin}
              </p>
              <span
                className={`rounded-lg px-1 font-light font-lexend text-color-text-black text-10px border-0.6 border-custom-grey-100
                ${
                  customTableData.propertyUse === "Commercial"
                    ? "bg-color-light-red"
                    : customTableData.propertyUse === "Residential"
                    ? "bg-color-light-yellow"
                    : "bg-custom-blue-200"
                }
                `}
              >
                {customTableData.propertyUse.toUpperCase()}
              </span>
              <span
                className={`rounded-md px-2 py-0.5 font-light text-[10px] text-white font-lexend
                ${
                  customTableData.paymentStatus === "Ungenerated"
                    ? "bg-color-bright-orange"
                    : customTableData.paymentStatus === "Unpaid"
                    ? "bg-color-bright-red"
                    : "bg-color-bright-green"
                }
                `}
              >
                {customTableData.paymentStatus}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="flex items-center justify-center w-[24px] h-[24px] text-xs text-primary-color font-lexend font-medium px-0.5 border border-primary-color rounded hover:cursor-pointer"
                onClick={() => alert("Edit Property")}
                title="Edit Property"
              >
                <BiSolidEditAlt />
              </span>
              <span
                className="flex items-center justify-center w-[24px] h-[24px] text-xs text-color-dark-red font-lexend font-medium px-0.5 border border-color-dark-red rounded hover:cursor-pointer"
                onClick={hideViewPropertyModal}
                title="Close Property Modal"
              >
                <MdCancel />
              </span>
            </div>
          </div>
          <div className="flex-col space-y-6 h-[120vh]">
            <div className="flex items-center gap-2 p-0.5 border-0.6 border-custom-color-one rounded">
              {["Details", "Occupant Details", "Invoices"].map(
                (item, index) => (
                  <button
                    key={index}
                    className={`text-xs text-color-text-two font-lexend px-2 py-1 ${
                      activateState === index
                        ? "text-white font-medium bg-primary-color rounded"
                        : ""
                    }`}
                    type="button"
                    onClick={() => {
                      setActiveState(index);
                    }}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
            <div className="flex-col p-2 space-y-2 border rounded border-custom-color-two">
              <div className="flex items-center gap-1.5 text-xs text-custom-blue-300 font-lexend">
                <span className="text-lg">
                  <PiBuildingsFill />
                </span>
                DETAILS
              </div>
              {[
                {
                  name: "Property Identification Number",
                  value: customTableData.pin,
                },
                { name: "Asset Number", value: customTableData.assetNumber },
                {
                  name: "Cadastral Zone",
                  value: customTableData.cadestralZone,
                },
                { name: "Property Address", value: customTableData.address },
                { name: "Rating District", value: customTableData.amacZones },
              ].map((item) => (
                <div className="flex items-center justify-between font-lexend">
                  <p className="px-1 py-0.5 text-darkblueberry rounded bg-lightblue text-xs">
                    {item.name}
                  </p>
                  <p className="flex w-[50%] justify-end text-xs font-bold text-color-text-black">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex-col p-2 space-y-2 border-0.6 rounded border-color-text-two">
              <div className="flex items-center gap-1.5 text-xs text-color-text-two font-lexend">
                <span className="text-lg">
                  <GiStarFormation />
                </span>
                PROPERTIES
              </div>
              {[
                { name: "Category", value: customTableData.propertyUse },
                { name: "Group", value: customTableData.amacZones },
                { name: "Property Type", value: customTableData.propertyType },
                { name: "Property Use", value: customTableData.propertyUse },
                {
                  name: "Occupation Status",
                  value: customTableData.occupationStatus,
                },
              ].map((item) => (
                <div className="flex items-center justify-between font-lexend">
                  <p className="px-1 py-0.5 text-darkerblueberry rounded bg-custom-blue-100 text-xs">
                    {item.name}
                  </p>
                  <p className="flex w-[50%] justify-end text-xs font-bold text-color-text-black">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex-col p-2 space-y-2 border-0.6 rounded border-color-text-two">
              <div className="flex items-center gap-1.5 text-xs text-color-text-two font-lexend">
                <span className="text-lg">
                  <TbCurrencyNaira />
                </span>
                VALUATION
              </div>
              {[
                {
                  name: "Annual Value",
                  value: formatNumberWithCommas(customTableData.annualValue),
                },
                { name: "Rate Payable", value: "0.00" },
                { name: "Arrears", value: "0.00" },
                { name: "Penalty", value: "0.00" },
                { name: "Grand Total", value: "0.00" },
              ].map((item) => (
                <div className="flex items-center justify-between font-lexend">
                  <p className="px-1 py-0.5 text-darkerblueberry rounded bg-custom-blue-100 text-xs">
                    {item.name}
                  </p>
                  <p className="flex w-[50%] justify-end text-xs font-bold text-color-text-black">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between p-2 space-y-2 border-0.6 rounded bg-light-red border-color-light-red font-lexend">
              <div className="flex items-center gap-1.5 text-color-dark-red">
                <BsCalendar2EventFill />
                <p className="text-xs">DAYS TO NEXT INVOICE</p>
              </div>
              <span className="px-2 py-0.5 rounded text-xs bg-color-light-red text-darkerblueberry">
                {customTableData.daysToNextInvoice}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
