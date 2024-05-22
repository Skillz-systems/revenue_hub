import React from "react";
import { GoDotFill } from "react-icons/go";
import { TbCurrencyNaira } from "react-icons/tb";
import { formatNumberWithCommas } from "../../Utils/client";
import { BiSolidEditAlt } from "react-icons/bi";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

type PropertiesTableProps = {
  personalIdentificationNumber: string,
  propertyUse: string,
  paymentStatus: string,
  propertyAddress: string,
  group: string,
  cadestralZone: string,
  ratePaybale: number,
  setViewPropertyModal: () => void,
  occupationStatus: string,
};

const PropertiesTable: React.FC<PropertiesTableProps> = ({
  personalIdentificationNumber,
  propertyUse,
  paymentStatus,
  propertyAddress,
  group,
  cadestralZone,
  ratePaybale,
  setViewPropertyModal,
  occupationStatus,
}) => {
  return (
    <div
      className="flex-col border border-divider-grey w-[32%] rounded hover:cursor-pointer"
      onClick={setViewPropertyModal}
    >
      <div className="flex items-center justify-between px-2.5 py-3 gap-1 border-b border-divider-grey">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-color-text-one">
            {personalIdentificationNumber}
          </span>
          <span
            className={`rounded-md px-2 py-0.5 font-light font-lexend text-color-text-black text-[10px] border-0.6 border-custom-grey-100
            ${
              propertyUse === "Commercial"
                ? "bg-color-light-red"
                : propertyUse === "Residential"
                ? "bg-color-light-yellow"
                : "bg-custom-blue-200"
            }
            `}
          >
            {propertyUse.toUpperCase()}
          </span>
        </div>
        <span
          className={`rounded-md px-2 py-0.5 font-light text-[10px] text-white font-lexend
          ${
            paymentStatus === "Ungenerated"
              ? "bg-primary-color"
              : paymentStatus === "Unpaid"
              ? "bg-color-bright-orange"
              : paymentStatus === "Expired"
              ? "bg-color-bright-red"
              : "bg-color-bright-green"
          }
          `}
        >
          {paymentStatus}
        </span>
      </div>
      <div className="fle-col px-2.5 py-3 space-y-2">
        <div className="text-xs font-lexend text-color-text-black">
          {propertyAddress}
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-0.5 px-1 py-0.5 text-xs font-light rounded font-lexend text-custom-blue-500 bg-custom-blue-100 border-0.6 border-custom-grey-100">
            <span className="text-blueberry">
              <GoDotFill />
            </span>
            {group}
          </span>
          <span className="flex items-center gap-0.5 px-1 py-0.5 text-xs font-light rounded font-lexend text-custom-blue-500 bg-custom-blue-100 border-0.6 border-custom-grey-100">
            <GoDotFill />
            {cadestralZone}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between px-2.5 py-3">
        <span className="px-1 py-0.5 text-xs font-light rounded font-lexend text-color-text-black bg-custom-blue-100 border-0.6 border-custom-grey-100">
          Rate Payable
        </span>
        <span className="flex items-center gap-0.5 font-chonburi text-color-text-black">
          <span className="text-lg text-blueberry">
            <TbCurrencyNaira />
          </span>
          <span className="text-sm">{formatNumberWithCommas(ratePaybale)}</span>
        </span>
      </div>
      <div className="bg-custom-blue-100 flex items-center justify-between px-2.5 py-3 border-t border-divider-grey">
        <span className="text-xs font-lexend text-color-text-two">
          {occupationStatus}
        </span>
        <div className="flex items-center justify-between gap-2">
          <span className="text-blueberry flex items-center justify-center rounded w-[30px] h-[30px] p-0.5 border-0.6 border-custom-grey-100">
            <span
              title="Edit Property"
              className="text-xl hover:cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                alert("Edit Property");
              }}
            >
              <BiSolidEditAlt />
            </span>
          </span>
          <span className="text-blueberry flex items-center justify-center rounded w-[30px] h-[30px] p-0.5 border-0.6 border-custom-grey-100">
            <span
              title="More Options"
              className="text-xl hover:cursor-pointer text-custom-grey-300"
              onClick={(e) => {
                e.stopPropagation();
                alert("Options Modal");
              }}
            >
              <HiOutlineDotsHorizontal />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertiesTable;