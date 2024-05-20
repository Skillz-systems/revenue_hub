import React, { useState, useEffect } from "react";
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

interface InvoiceData {
  dateCreated: string;
  arrears: number;
  penalty: number;
}

interface OccupantInfo {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  maritalStatus: string;
}

interface CustomTableData {
  personalIdentificationNumber: string;
  assetNumber: string;
  cadestralZone: string;
  propertyAddress: string;
  propertyUse: string;
  group: string;
  propertyType: string;
  occupationStatus: string;
  annualValue: number;
  ratePayable: number;
  demandInvoiceData: InvoiceData[];
  occupantInfo: OccupantInfo[];
  paymentStatus: string;
}

interface ViewPropertyModalProps {
  hideViewPropertyModal: () => void;
  propertyModalTransition: boolean;
  customTableData: CustomTableData;
}

const ViewPropertyModal: React.FC<ViewPropertyModalProps> = ({
  hideViewPropertyModal,
  propertyModalTransition,
  customTableData,
}) => {
  const [activateState, setActiveState] = useState<number>(0);
  const [daysUntilDue, setDaysUntilDue] = useState<number | null>(null);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [demandInvoiceDocument, setDemandInvoiceDocument] = useState<boolean>(false);

  const generateDueDate = (): string => {
    // Split the date string into day, month, and year
    const [day, month, year] =
      customTableData.demandInvoiceData[
        customTableData.demandInvoiceData.length - 1
      ].dateCreated.split("/");

    // Create a new Date object with the correct order of day, month, and year
    const dateCreated = new Date(`${month}/${day}/${year}`);

    // Add 365 days to the date
    const dueDate = new Date(dateCreated);
    dueDate.setDate(dateCreated.getDate() + 365);

    // Format the due date as desired
    return dueDate.toDateString();
  };

  useEffect(() => {
    const dueDate = new Date(generateDueDate());
    const currentDate = new Date();
    const differenceInTime = dueDate.getTime() - currentDate.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    setDaysUntilDue(differenceInDays);
  }, [
    customTableData.demandInvoiceData[
      customTableData.demandInvoiceData.length - 1
    ].dateCreated,
  ]);

  const grandTotal = formatNumberWithCommas(
    customTableData.annualValue +
    customTableData.ratePayable +
    customTableData.demandInvoiceData[
      customTableData.demandInvoiceData.length - 1
    ].arrears -
    customTableData.demandInvoiceData[
      customTableData.demandInvoiceData.length - 1
    ].penalty
  );

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
                {customTableData.personalIdentificationNumber}
              </p>
              <span
                className={`rounded-lg px-1 font-light font-lexend text-color-text-black text-[10px] border-0.6 border-custom-grey-100
                ${customTableData.propertyUse === "Commercial"
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
                ${customTableData.paymentStatus === "Ungenerated"
                    ? "bg-primary-color"
                    : customTableData.paymentStatus === "Unpaid"
                      ? "bg-color-bright-orange"
                      : customTableData.paymentStatus === "Expired"
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
                      customTableData.paymentStatus !== "Ungenerated" ? (
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
                      value: customTableData.personalIdentificationNumber,
                    },
                    {
                      name: "Asset Number",
                      value: customTableData.assetNumber,
                    },
                    {
                      name: "Cadastral Zone",
                      value: customTableData.cadestralZone,
                    },
                    {
                      name: "Property Address",
                      value: customTableData.propertyAddress,
                    },
                    {
                      name: "Rating District",
                      value: customTableData.cadestralZone.toUpperCase(),
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
                    { name: "Category", value: customTableData.propertyUse },
                    { name: "Group", value: customTableData.group },
                    {
                      name: "Property Type",
                      value: customTableData.propertyType,
                    },
                    {
                      name: "Property Use",
                      value: customTableData.propertyUse,
                    },
                    {
                      name: "Occupation Status",
                      value: customTableData.occupationStatus.toUpperCase(),
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
                              customTableData.occupationStatus === "Unoccupied"
                              ? "text-color-bright-red"
                              : index === 4 &&
                                customTableData.occupationStatus === "Occupied"
                                ? "text-color-bright-green"
                                : "text-color-text-black"
                            }
                        ${index === 3 &&
                              customTableData.propertyUse === "Commercial"
                              ? "bg-color-light-red rounded-lg px-1 font-light font-lexend text-color-text-black text-[10px] border-[0.4px] border-divider-grey"
                              : index === 3 &&
                                customTableData.propertyUse === "Residential"
                                ? "bg-color-light-yellow rounded-lg px-1 font-light font-lexend text-color-text-black text-[10px] border-[0.4px] border-divider-grey"
                                : index === 3
                                  ? "bg-custom-blue-200 rounded-lg px-1 font-light font-lexend text-color-text-black text-[10px] border-[0.4px] border-divider-grey"
                                  : ""
                            }
                      `}
                        >
                          {index === 3 ? item.value.toUpperCase() : item.value}
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
                        customTableData.annualValue
                      ),
                    },
                    {
                      name: "Rate Payable",
                      value: formatNumberWithCommas(
                        customTableData.ratePayable
                      ),
                    },
                    {
                      name: "Arrears",
                      value: formatNumberWithCommas(
                        customTableData.demandInvoiceData[
                          customTableData.demandInvoiceData.length - 1
                        ].arrears
                      ),
                    },
                    {
                      name: "Penalty",
                      value: formatNumberWithCommas(
                        customTableData.demandInvoiceData[
                          customTableData.demandInvoiceData.length - 1
                        ].penalty
                      ),
                    },
                    { name: "Grand Total", value: grandTotal },
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

            {activateState === 1 &&
              customTableData.occupationStatus === "Occupied" &&
              customTableData.paymentStatus !== "Ungenerated" ? (
              <div className="flex-col p-2 space-y-2 border-0.6 rounded border-color-text-two">
                <div className="flex items-center gap-1.5 text-xs text-color-text-two font-lexend">
                  <span className="text-lg">
                    <FaPeopleRoof />
                  </span>
                  OCCUPANT DETAILS
                </div>
                {[
                  {
                    name: "First Name",
                    value:
                      customTableData.occupantInfo[
                        customTableData.occupantInfo.length - 1
                      ].firstName,
                  },
                  {
                    name: "LastName",
                    value:
                      customTableData.occupantInfo[
                        customTableData.occupantInfo.length - 1
                      ].lastName,
                  },
                  {
                    name: "Phone Number",
                    value:
                      customTableData.occupantInfo[
                        customTableData.occupantInfo.length - 1
                      ].phoneNumber,
                  },
                  {
                    name: "Email",
                    value:
                      customTableData.occupantInfo[
                        customTableData.occupantInfo.length - 1
                      ].email,
                  },
                  {
                    name: "Marital Status",
                    value:
                      customTableData.occupantInfo[
                        customTableData.occupantInfo.length - 1
                      ].maritalStatus,
                  },
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
            ) : null}

            {activateState === 1 &&
              customTableData.occupationStatus === "Unoccupied" ? (
              <p className="text-sm text-color-text-black font-lexend">
                There are no current occupants on the property.
              </p>
            ) : null}
            {activateState !== 2 ? (
              <div className="flex items-center justify-between p-2 space-y-2 border-0.6 rounded bg-light-red border-color-light-red font-lexend">
                <div className="flex items-center gap-1.5 text-color-dark-red">
                  <BsCalendar2EventFill />
                  <p className="text-xs">
                    {customTableData.paymentStatus === "Ungenerated"
                      ? "No Invoice has been generated on this property"
                      : customTableData.paymentStatus === "Expired"
                        ? "DEMAND INVOICE HAS EXPIRED"
                        : customTableData.paymentStatus === "Paid"
                          ? "DEMAND INOICE HAS BEEN PAID"
                          : "DAYS TO NEXT INVOICE"}
                  </p>
                </div>
                {customTableData.paymentStatus === "Unpaid" ? (
                  <span className="px-2 py-0.5 rounded text-xs bg-color-light-red text-darkerblueberry">
                    {daysUntilDue}
                  </span>
                ) : null}
              </div>
            ) : null}

            {activateState === 2 &&
              customTableData.paymentStatus === "Ungenerated" ? (
              <p className="text-sm text-color-text-black font-lexend">
                No Invoice has been generated on this property.
              </p>
            ) : null}

            {activateState === 2 &&
              customTableData.paymentStatus !== "Ungenerated" ? (
              <div className="flex items-center justify-between gap-3 text-xs group">
                <span className="flex flex-wrap items-center justify-center w-20 h-8 px-2 py-1 text-xs font-medium rounded text-color-text-three bg-custom-blue-400">
                  {customTableData.personalIdentificationNumber}
                </span>
                <span className="flex flex-wrap items-center text-[10px] font-lexend text-color-text-black">
                  {customTableData.propertyAddress}
                </span>
                <span className="flex flex-wrap items-center text-color-text-black font-lexend text-[10px]">
                  {
                    customTableData.demandInvoiceData[
                      customTableData.demandInvoiceData.length - 1
                    ].dateCreated
                  }
                </span>
                <span
                  className={`flex-wrap hidden items-center px-1 py-0.5 justify-center rounded-xl font-light font-lexend text-color-text-black text-[10px] border-0.6 border-custom-grey-100 group-hover:flex
                  ${customTableData.propertyUse === "Commercial"
                      ? "bg-color-light-red"
                      : customTableData.propertyUse === "Residential"
                        ? "bg-color-light-yellow"
                        : "bg-custom-blue-200"
                    }
               `}
                >
                  {customTableData.propertyUse.toUpperCase()}
                </span>
                <span className="flex flex-wrap items-center justify-center text-sm text-color-text-black font-chonburi">
                  {formatNumberWithCommas(customTableData.ratePayable)}
                </span>
                <div className="flex items-center justify-center">
                  <span
                    className={`flex flex-wrap items-center justify-center px-1 p-0.5 font-light text-white rounded font-lexend text-[10px]
                 ${customTableData.paymentStatus === "Ungenerated"
                        ? "bg-primary-color"
                        : customTableData.paymentStatus === "Unpaid"
                          ? "bg-color-bright-orange"
                          : customTableData.paymentStatus === "Expired"
                            ? "bg-color-bright-red"
                            : "bg-color-bright-green"
                      }
                 `}
                  >
                    {customTableData.paymentStatus}
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
                        {customTableData.paymentStatus === "Expired" ? (
                          <p
                            className="hover:cursor-pointer"
                            title="Generate Reminder"
                            onClick={() => alert("Generate Reminder")}
                          >
                            Generate Reminder
                          </p>
                        ) : customTableData.paymentStatus === "Unpaid" ? (
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