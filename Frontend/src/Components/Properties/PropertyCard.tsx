import React, { useState } from "react";
import { GoDotFill } from "react-icons/go";
import { TbCurrencyNaira } from "react-icons/tb";
import { formatNumberWithCommas, useTokens } from "../../Utils/client";
import { BiSolidEditAlt } from "react-icons/bi";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import axios from "axios";

type PropertiesTableProps = {
  id: number;
  personalIdentificationNumber: string;
  propertyUse: string;
  paymentStatus: string;
  propertyAddress: string;
  group: string;
  cadestralZone: string;
  ratePaybale: number;
  setViewPropertyModal: () => void;
  occupationStatus: string;
};

const PropertiesTable: React.FC<PropertiesTableProps> = ({
  id,
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
  const { token } = useTokens();
  const [settingsModal, setSettingsModal] = useState<boolean>(false);

  const deleteProperty = async (pid: number) => {
    try {
      const response = await axios.delete(
        `https://api.revenuehub.skillzserver.com/api/property/${pid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Headers
          },
        }
      );
      if (response.status === 200) {
        alert("Successfully removed property");
      } else {
        alert("Unexpected status code");
      }
    } catch (error) {
      if (error.response.status === 400) {
        alert("Bad request. Property Id is missing.");
      } else if (error.response.status === 401) {
        alert("You are unauthenticated");
      } else if (error.response.status === 403) {
        alert("You are unauthorized");
      } else if (error.response.status === 404) {
        alert("Demand notice not found");
      } else {
        alert("Internal Server Error");
      }
    }
  };

  const generateDemandNotice = async (pid: number) => {
    try {
      const response = await axios.post(
        "https://api.revenuehub.skillzserver.com/api/demand-notice/create",
        {
          property_id: pid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Headers
          },
        }
      );
      if (response.status === 200 || 201) {
        alert(`Succesfully created demand notice for ${pid}`);
      } else {
        alert("Unexpected status code");
      }
    } catch (error) {
      if (error.response.status === 400) {
        alert("Bad request. Property Id is missing.");
      } else if (error.response.status === 401) {
        alert("You are unauthenticated");
      } else if (error.response.status === 403) {
        alert("You are unauthorized");
      } else {
        alert("Internal Server Error");
      }
    }
  };

  return (
    <div className="flex-col border border-divider-grey w-[32%] rounded">
      <div className="flex items-center justify-between px-2.5 py-3 gap-1 border-b border-divider-grey">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-color-text-one">
            {personalIdentificationNumber}
          </span>
          <span
            className={`rounded-md px-2 py-0.5 font-light font-lexend text-color-text-black text-[10px] border-0.6 border-custom-grey-100
            ${
              propertyUse === "COMMERCIAL"
                ? "bg-color-light-red"
                : propertyUse === "RESIDENTIAL"
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
      <div
        className="fle-col px-2.5 py-3 space-y-2 hover:cursor-pointer"
        onClick={setViewPropertyModal}
      >
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
          <span className="relative text-blueberry flex items-center justify-center rounded w-[30px] h-[30px] p-0.5 border-0.6 border-custom-grey-100">
            <span
              title="More Options"
              className="text-xl hover:cursor-pointer text-custom-grey-300"
              onClick={() => {
                setSettingsModal(!settingsModal);
              }}
            >
              <HiOutlineDotsHorizontal />
            </span>
            {settingsModal && (
              <span className="absolute space-y-2 top-0 z-10 flex-col w-40 p-4 text-xs bg-white rounded shadow-md -left-44 border-0.6 border-custom-grey-100 text-color-text-black font-lexend">
                {paymentStatus === "Ungenerated" ? (
                  <p
                    className="hover:cursor-pointer"
                    title="View Demand Notice"
                    onClick={() => generateDemandNotice(id)}
                  >
                    Generate Demand Notice
                  </p>
                ) : null}
                <p
                  className="hover:cursor-pointer"
                  title="View Demand Notice"
                  onClick={setViewPropertyModal}
                >
                  View Property
                </p>
                <p
                  className="hover:cursor-pointer"
                  title="View Demand Notice"
                  onClick={() => deleteProperty(id)}
                >
                  Delete Property
                </p>
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertiesTable;
