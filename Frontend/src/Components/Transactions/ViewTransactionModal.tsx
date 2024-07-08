import React from "react";
import { MdCancel } from "react-icons/md";
import { TbCurrencyNaira } from "react-icons/tb";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { PiBuildingsFill } from "react-icons/pi";
import { formatNumberWithCommas, formatDate } from "../../Utils/client";
import { TransactionsType } from "../Index";

interface ViewTransactionModalProps {
  hideViewPropertyModal: () => void;
  propertyModalTransition: boolean;
  customTableData: TransactionsType;
}

const ViewTransactionModal: React.FC<ViewTransactionModalProps> = ({
  hideViewPropertyModal,
  propertyModalTransition,
  customTableData,
}) => {
  return (
    <div
      className={`flex-col relative min-w-[290px] sm:min-w-[350px] md:min-w-[500px] bg-white rounded overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white ${
        propertyModalTransition
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
      <div className="absolute z-10 flex-col w-full p-4 space-y-3 ">
        <div
          className="flex items-start justify-between"
          style={{ height: "10vh" }}
        >
          <div className="flex flew-wrap items-center gap-2 w-[70%] md:w-auto">
            <h3 className="text-base font-bold text-color-text-two">TID</h3>
            <p className="text-base font-bold text-color-text-one">
              {customTableData.demand_notice.property.pid}
            </p>
            <span
              className={`rounded px-2 py-1 font-lexend text-darkerblueberry text-xs border-0.6 border-custom-grey-100
                  ${customTableData.tx_ref ? "bg-neon-green" : "bg-[#FF3131]"}
                  `}
            >
              {"Success"}
            </span>
          </div>
          <div className="flex items-center justify-end gap-2 w-[20%] md:w-auto">
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
          <div className="flex-col p-2 space-y-2 border rounded border-custom-color-two">
            <div className="flex items-center gap-1.5 text-xs text-custom-blue-300 font-lexend">
              <span className="text-lg">
                <FaMoneyBillTransfer />
              </span>
              TRANSACTION DETAILS
            </div>
            {[
              {
                name: "Transaction ID",
                value: customTableData.tx_ref,
              },
              {
                name: "Transaction Type",
                value: customTableData.app_fee
                  ? "MOBILE TRANSFER"
                  : "BANK TRANSFER",
              },
              {
                name: "Transaction Date",
                value: formatDate(
                  customTableData.demand_notice.property.updated_at
                ),
              },
              {
                name: "Transaction Time",
                value: customTableData.demand_notice.property.updated_at,
              },
            ].map((item, index) => (
              <div className="flex items-center justify-between font-lexend">
                <p className="px-1 py-0.5 text-darkblueberry rounded bg-lightblue text-xs">
                  {item.name}
                </p>
                <p className="flex w-[50%] justify-end text-xs font-medium text-color-text-black">
                  <span
                    className={`${
                      index === 1 && customTableData.app_fee
                        ? "bg-color-light-red font-light text-[10px] rounded-xl px-1 py-0.5 border-[0.4px] border-divider-grey"
                        : (index === 1 && customTableData?.app_fee === null) ||
                          ""
                        ? "bg-color-light-yellow font-light text-[10px] rounded-xl px-1 py-0.5 border-[0.4px] border-divider-grey"
                        : ""
                    }`}
                  >
                    {item.value}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-col p-2 space-y-2 border-0.6 rounded border-color-text-two">
          <div className="flex items-center gap-1.5 text-xs text-color-text-two font-lexend">
            <span className="text-lg">
              <PiBuildingsFill />
            </span>
            PROPERTY DETAILS
          </div>
          {[
            {
              name: "Property ID",
              value: customTableData.demand_notice.property.pid,
            },
            {
              name: "Asset Number",
              value: customTableData.demand_notice.property.asset_no,
            },
            {
              name: "Cadastral Zone",
              value: customTableData.demand_notice.property.cadastral_zone,
            },
            {
              name: "Address",
              value: customTableData.demand_notice.property.prop_addr,
            },
            {
              name: "Rating District",
              value:
                customTableData.demand_notice.property.rating_dist.toUpperCase(),
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between font-lexend"
            >
              <p className="px-1 py-0.5 text-darkerblueberry rounded bg-custom-blue-100 text-xs">
                {item.name}
              </p>
              <p className="flex w-[50%] justify-end text-xs font-medium">
                <span className="flex items-center justify-center">
                  {item.value}
                </span>
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between p-2 space-y-2 border-0.6 rounded bg-white border-custom-color-one font-lexend">
          <div className="flex items-center gap-1.5 text-color-bright-green">
            <TbCurrencyNaira />
            <p className="text-xs text-darkerblueberry">Amount</p>
          </div>
          <span className="px-2 py-0.5 rounded text-xs bg-custom-grey-100 text-darkerblueberry">
            {formatNumberWithCommas(customTableData.actual_amount)}
          </span>
        </div>
        <div className="flex items-center justify-between p-2 space-y-2 border-0.6 rounded bg-light-neon-green border-neon-green font-lexend">
          <div className="flex items-center gap-1.5 text-color-bright-green">
            <FaMoneyBillTransfer />
            <p className="text-xs">Transaction Status</p>
          </div>
          <span className="px-2 py-0.5 rounded text-xs bg-neon-green text-darkerblueberry">
            {"SUCCESS"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ViewTransactionModal;
