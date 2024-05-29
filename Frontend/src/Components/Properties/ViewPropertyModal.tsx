import React, { useState } from "react";
import { MdCancel } from "react-icons/md";
import { BiSolidEditAlt } from "react-icons/bi";
import { PiBuildingsFill } from "react-icons/pi";
import { GiStarFormation } from "react-icons/gi";
import { TbCurrencyNaira } from "react-icons/tb";
import { BsCalendar2EventFill } from "react-icons/bs";
import { formatNumberWithCommas } from "../../Utils/client";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaPeopleRoof } from "react-icons/fa6";
import { DemandPropertyModal, DemandInvoiceDocument } from "../Index";

export type PropertyData = {
  active: string;
  annual_value: string;
  asset_no: string;
  cadastral_zone: string;
  category: string | null;
  demand_notice: any[];
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
  arrears: number;
  penalty: number;
  demand_notice_status: string;
};

interface ViewPropertyModalProps {
  hideViewPropertyModal: () => void;
  propertyModalTransition: boolean;
  customTableData: PropertyData;
}

const ViewPropertyModal: React.FC<ViewPropertyModalProps> = ({
  hideViewPropertyModal,
  propertyModalTransition,
  customTableData,
}) => {
  const [activateState, setActiveState] = useState<number>(0);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [demandInvoiceDocument, setDemandInvoiceDocument] = useState<boolean>(false);

  return (
    <>
      <div
        className={`flex-col relative bg-white rounded overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white ${propertyModalTransition
          ? "w-6/12 transition-all ease-in-out duration-500"
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
                {customTableData.pid}
              </p>
              <span
                className={`rounded-lg px-1 font-light font-lexend text-color-text-black text-[10px] border-0.6 border-custom-grey-100
                ${customTableData.prop_use === "Commercial"
                    ? "bg-color-light-red"
                    : customTableData.prop_use === "Residential"
                      ? "bg-color-light-yellow"
                      : "bg-custom-blue-200"
                  }
                `}
              >
                {customTableData.prop_use.toUpperCase()}
              </span>
              <span
                className={`rounded-md px-2 py-0.5 font-light text-[10px] text-white font-lexend
                ${customTableData.demand_notice_status === "Ungenerated"
                    ? "bg-primary-color"
                    : customTableData.demand_notice_status === "Unpaid"
                      ? "bg-color-bright-orange"
                      : customTableData.demand_notice_status === "Expired"
                        ? "bg-color-bright-red"
                        : "bg-color-bright-green"
                  }
                `}
              >
                {customTableData.demand_notice_status}
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
          <div className="flex-col space-y-6">
            <div className="flex items-center gap-2 p-0.5 border-0.6 border-custom-color-one rounded">
              {["Details", "Occupant Details", "Invoices"].map(
                (item, index) => (
                  <button
                    key={index}
                    className={`flex gap-2 text-xs text-color-text-two font-lexend px-2 py-1 ${activateState === index
                      ? "text-white font-medium bg-primary-color rounded"
                      : ""
                      }`}
                    type="button"
                    onClick={() => {
                      setActiveState(index);
                    }}
                  >
                    {item}
                    {item === "Invoices" ? (
                      customTableData.status !== "Ungenerated" ? (
                        <span className="px-1.5 text-xs border rounded text-color-text-three font-lexend bg-custom-blue-200 border-custom-color-two">
                          {/* {customTableData.demandInvoiceData.length} */}1
                        </span>
                      ) : null
                    ) : null}
                  </button>
                )
              )}
            </div>
            {activateState === 0 ? (
              <>
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
                      value: customTableData.pid,
                    },
                    {
                      name: "Asset Number",
                      value: customTableData.asset_no,
                    },
                    {
                      name: "Cadastral Zone",
                      value: customTableData.cadastral_zone,
                    },
                    {
                      name: "Property Address",
                      value: customTableData.prop_addr,
                    },
                    {
                      name: "Rating District",
                      value: customTableData.cadastral_zone.toUpperCase(),
                    },
                  ].map((item) => (
                    <div className="flex items-center justify-between font-lexend">
                      <p className="px-1 py-0.5 text-darkblueberry rounded bg-lightblue text-xs">
                        {item.name}
                      </p>
                      <p className="flex w-[50%] justify-end text-xs font-medium text-color-text-black">
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
                    { name: "Category", value: customTableData.category },
                    { name: "Group", value: customTableData.group },
                    {
                      name: "Property Type",
                      value: customTableData.prop_type,
                    },
                    {
                      name: "Property Use",
                      value: customTableData.prop_use,
                    },
                    {
                      name: "Occupation Status",
                      value: customTableData?.status?.toUpperCase() || "Occupied",
                    },
                  ].map((item, index) => (
                    <div className="flex items-center justify-between font-lexend">
                      <p className="px-1 py-0.5 text-darkerblueberry rounded bg-custom-blue-100 text-xs">
                        {item.name}
                      </p>
                      <p className="flex w-[50%] justify-end text-xs font-medium">
                        <span
                          className={`flex items-center justify-center 
                    
                        ${index === 4 &&
                              customTableData.status === "Unoccupied"
                              ? "text-color-bright-red"
                              : index === 4 &&
                                customTableData.status === "Occupied"
                                ? "text-color-bright-green"
                                : "text-color-text-black"
                            }
                        ${index === 3 &&
                              customTableData.prop_use === "Commercial"
                              ? "bg-color-light-red rounded-lg px-1 font-light font-lexend text-color-text-black text-[10px] border-[0.4px] border-divider-grey"
                              : index === 3 &&
                                customTableData.prop_use === "Residential"
                                ? "bg-color-light-yellow rounded-lg px-1 font-light font-lexend text-color-text-black text-[10px] border-[0.4px] border-divider-grey"
                                : index === 3
                                  ? "bg-custom-blue-200 rounded-lg px-1 font-light font-lexend text-color-text-black text-[10px] border-[0.4px] border-divider-grey"
                                  : ""
                            }
                      `}
                        >
                          {index === 3 ? item.value?.toUpperCase() : item.value}
                        </span>
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
                      value: formatNumberWithCommas(
                        customTableData.annual_value
                      ),
                    },
                    {
                      name: "Rate Payable",
                      value: formatNumberWithCommas(
                        customTableData.rate_payable
                      ),
                    },
                    {
                      name: "Arrears",
                      value: formatNumberWithCommas(
                        customTableData?.arrears || 10000
                      ),
                    },
                    {
                      name: "Penalty",
                      value: formatNumberWithCommas(
                        customTableData?.penalty || 1000
                      ),
                    },
                    { name: "Grand Total", value: formatNumberWithCommas(customTableData.grand_total) },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between font-lexend"
                    >
                      <p className="px-1 py-0.5 text-darkerblueberry rounded bg-custom-blue-100 text-xs">
                        {item.name}
                      </p>
                      <p
                        className={`flex w-[50%] justify-end text-xs font-medium ${index === 3
                          ? "text-color-bright-red"
                          : "text-color-text-black"
                          }`}
                      >
                        {index === 3 ? `(${item.value})` : item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : null}

            {activateState === 1 && (
              <div className="flex-col p-2 space-y-2 border-0.6 rounded border-color-text-two">
                <div className="flex items-center gap-1.5 text-xs text-color-text-two font-lexend">
                  <span className="text-lg">
                    <FaPeopleRoof />
                  </span>
                  OCCUPANT DETAILS
                </div>
                {[
                  {
                    name: "Occupant",
                    value:
                      customTableData?.occupant
                  },
                  // {
                  //   name: "LastName",
                  //   value:
                  //     customTableData?.occupantInfo[
                  //       customTableData?.occupantInfo?.length - 1
                  //     ].lastName,
                  // },
                  // {
                  //   name: "Phone Number",
                  //   value:
                  //     customTableData?.occupantInfo[
                  //       customTableData?.occupantInfo?.length - 1
                  //     ].phoneNumber,
                  // },
                  // {
                  //   name: "Email",
                  //   value:
                  //     customTableData?.occupantInfo[
                  //       customTableData?.occupantInfo?.length - 1
                  //     ].email,
                  // },
                  // {
                  //   name: "Marital Status",
                  //   value:
                  //     customTableData?.occupantInfo[
                  //       customTableData?.occupantInfo?.length - 1
                  //     ].maritalStatus,
                  // },
                ].map((item) => (
                  <div className="flex items-center justify-between font-lexend">
                    <p className="px-1 py-0.5 text-darkerblueberry rounded bg-custom-blue-100 text-xs">
                      {item.name}
                    </p>
                    <p className="flex w-[50%] justify-end text-xs font-medium text-color-text-black">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activateState === 1 &&
              customTableData?.occupant === "" ? (
              <p className="text-sm text-color-text-black font-lexend">
                There are no current occupants on the property.
              </p>
            ) : null}
            {activateState !== 2 ? (
              <div className="flex items-center justify-between p-2 space-y-2 border-0.6 rounded bg-light-red border-color-light-red font-lexend">
                <div className="flex items-center gap-1.5 text-color-dark-red">
                  <BsCalendar2EventFill />
                  <p className="text-xs">
                    {customTableData?.demand_notice_status === "Ungenerated"
                      ? "No Invoice has been generated on this property"
                      : customTableData?.demand_notice_status === "Expired"
                        ? "DEMAND INVOICE HAS EXPIRED"
                        : customTableData?.demand_notice_status === "Paid"
                          ? "DEMAND INOICE HAS BEEN PAID"
                          : "DAYS TO NEXT INVOICE"}
                  </p>
                </div>
                {customTableData?.demand_notice_status === "Unpaid" ? (
                  <span className="px-2 py-0.5 rounded text-xs bg-color-light-red text-darkerblueberry">
                    {365}
                  </span>
                ) : null}
              </div>
            ) : null}

            {activateState === 2 &&
              customTableData?.demand_notice_status === "Ungenerated" ? (
              <p className="text-sm text-color-text-black font-lexend">
                No Invoice has been generated on this property.
              </p>
            ) : null}

            {activateState === 2 &&
              customTableData.demand_notice_status !== "Ungenerated" ? (
              <div className="flex items-center justify-between gap-3 text-xs group">
                <span className="flex flex-wrap items-center justify-center w-20 h-8 px-2 py-1 text-xs font-medium rounded text-color-text-three bg-custom-blue-400">
                  {customTableData.pid}
                </span>
                <span className="flex flex-wrap items-center text-[10px] font-lexend text-color-text-black">
                  {customTableData.prop_addr}
                </span>
                <span className="flex flex-wrap items-center text-color-text-black font-lexend text-[10px]">
                  {`24/5/2024`}
                </span>
                <span
                  className={`flex-wrap hidden items-center px-1 py-0.5 justify-center rounded-xl font-light font-lexend text-color-text-black text-[10px] border-0.6 border-custom-grey-100 group-hover:flex
                  ${customTableData.prop_use === "Commercial"
                      ? "bg-color-light-red"
                      : customTableData.prop_use === "Residential"
                        ? "bg-color-light-yellow"
                        : "bg-custom-blue-200"
                    }
               `}
                >
                  {customTableData.prop_use.toUpperCase()}
                </span>
                <span className="flex flex-wrap items-center justify-center text-sm text-color-text-black font-chonburi">
                  {formatNumberWithCommas(customTableData.rate_payable)}
                </span>
                <div className="flex items-center justify-center">
                  <span
                    className={`flex flex-wrap items-center justify-center px-1 p-0.5 font-light text-white rounded font-lexend text-[10px]
                 ${customTableData?.demand_notice_status === "Ungenerated"
                        ? "bg-primary-color"
                        : customTableData?.demand_notice_status === "Unpaid"
                          ? "bg-color-bright-orange"
                          : customTableData?.demand_notice_status === "Expired"
                            ? "bg-color-bright-red"
                            : "bg-color-bright-green"
                      }
                 `}
                  >
                    {customTableData?.demand_notice_status}
                  </span>
                </div>
                <span className="flex flex-wrap items-center gap-1">
                  <span className="border-0.6 relative border-custom-grey-100 text-custom-grey-300 px-1 py-1 rounded text-base">
                    <span
                      title="Edit Invoice"
                      className="hover:cursor-pointer"
                      onClick={() => setEditModal(!editModal)}
                    >
                      <HiOutlineDotsHorizontal />
                    </span>
                    {editModal && (
                      <span className="absolute space-y-2 top-0 z-10 flex-col w-40 p-4 text-xs bg-white rounded shadow-md -left-44 border-0.6 border-custom-grey-100 text-color-text-black font-lexend">
                        <p
                          className="hover:cursor-pointer"
                          title="View Demand Notice"
                          onClick={() => setDemandInvoiceDocument(true)}
                        >
                          View Demand Notice
                        </p>
                        <p
                          className="hover:cursor-pointer"
                          title="View Property"
                          onClick={() => setActiveState(0)}
                        >
                          View Property
                        </p>
                        {customTableData?.demand_notice_status === "Expired" ? (
                          <p
                            className="hover:cursor-pointer"
                            title="Generate Reminder"
                            onClick={() => alert("Generate Reminder")}
                          >
                            Generate Reminder
                          </p>
                        ) : customTableData?.demand_notice_status === "Unpaid" ? (
                          <p
                            className="hover:cursor-pointer"
                            title="View Reminder"
                            onClick={() => alert("View Reminder")}
                          >
                            View Reminder
                          </p>
                        ) : null}
                      </span>
                    )}
                  </span>
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
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
            customTableData={customTableData}
          />
        </DemandPropertyModal>
      ) : null}
    </>
  );
}

export default ViewPropertyModal;