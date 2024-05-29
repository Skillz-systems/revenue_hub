import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import { formatNumberWithCommas } from "../Utils/client";
import axios from "axios";
import images from "../assets";

const Payment = () => {
  const { pid } = useParams();
  const [paymentAccount, setPaymentAccount] = useState<any>(null);
  const [demandInvoiceInfo, setDemandInvoiceInfo] = useState<any>(null);
  const [buttonInfo, setButtonInfo] = useState<boolean | string>(false);

  const generatePaymentDetails = async () => {
    try {
      setButtonInfo(`Generating Payment Information for PID-${pid}...`);
      const response = await axios.get(
        `https://api.revenuehub.skillzserver.com/api/payment/generate-account/${pid}`
      );
      if (response.status === 200) {
        console.log(
          "Successfully generated payment account:",
          response.data.data
        );
        setPaymentAccount(response.data.data);
        setButtonInfo(
          `Successfuly generated payment information for customer with PID-${pid}`
        );
      } else {
        console.error(
          "Unexpected status code while generating payment account:",
          response.status
        );
        setButtonInfo(
          "Unexpected status code. Something went wrong please try again."
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized:", error.response.data);
        setButtonInfo(`You are Unauthorized: ${error}`);
      } else {
        console.error("Internal Server Error:", error);
        setButtonInfo(`Internal Server Error: ${error}`);
      }
    }
  };

  const fetchPaymentDetails = async () => {
    try {
      const response = await axios.get(
        `https://api.revenuehub.skillzserver.com/api/payment/view/${pid}`
      );
      if (response.status === 200) {
        console.log("Success:", response.data);
        setDemandInvoiceInfo(response.data);
      } else {
        console.error("Unexpected status code:", response.status);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized:", error.response.data);
      } else {
        console.error("Internal Server Error:", error);
      }
    }
  };

  useEffect(() => {
    if (pid) {
      fetchPaymentDetails();
    } else {
      console.log("PID is undefined");
      alert("This page doesn't exist");
    }
  }, [pid]);

  const demandInvoiceData = {
    Occupant: `THE OCCUPIER/${pid}`,
    PropertyIdentificationNumber: `PID-${pid}`,
    QrCodePayment: "3191313-0482402470",
    propertyData: [
      { label: "Name of Occupier", value: `${pid}` },
      { label: "Assessment No", value: "AM/B12/TTR/2016/0400" },
      {
        label: "Property Address",
        value: demandInvoiceInfo?.property.prop_addr,
      },
      {
        label: "Cadestral Zone",
        value: demandInvoiceInfo?.property.cadastral_zone,
      },
      { label: "Use of Property", value: demandInvoiceInfo?.property.prop_use },
      {
        label: "Rating District",
        value: demandInvoiceInfo?.property.rating_dist,
      },
    ],
  };
  return (
    <div className="flex flex-col items-center justify-center py-2 space-y-2 bg-white w-[100%] h-[100vh] rounded">
      {/* PDF START*/}
      {!paymentAccount ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="font-lexend text-color-text-black">
            You are about to make payment for your AMAC Demand Notice for
            Property with <b>PID-{pid}</b>.
          </h1>
          <div className="flex flex-col items-center justify-center w-[300px] bg-white border border-grey rounded shadow-md px-4 py-4">
            <img src={images.logo} alt="Logo" className="w-60 md:w-[150px]" />
            <button
              className="px-3 py-2 text-white rounded bg-primary-color font-lexend"
              onClick={generatePaymentDetails}
            >
              Proceed to make payment
            </button>
          </div>
          <p className="font-lexend">{buttonInfo}</p>
        </div>
      ) : null}
      {paymentAccount ? (
        <div className="bg-white print-section flex flex-col px-4 py-6 space-y-2 w-[100%] max-w-[595px] border border-custom-color-100 rounded shadow-xl">
          {/* 1ST SECTION */}
          <div className="flex items-center justify-center w-full">
            <div className="flex items-start justify-start w-[18%] ">
              <img src={"/abujalogo.png"} alt="Abuja Logo" className="w-55px" />
            </div>
            <div className="flex flex-col text-center w-[64%] ">
              <h1 className="text-sm font-bold leading-4 text-primary-color font-work-sans">
                ABUJA MUNICIPAL AREA COUNCIL
              </h1>
              <h2 className="text-[11px] font-bold leading-[13px] text-color-dark-red font-work-sans">
                TENEMENT RATE & VALUATION OFFICE
              </h2>
              <p className="text-document-grey font-lexend text-[11px] leading-[13.75px]">
                Secreteriat: No 1 Olusegun Obasanjo Way, Area 10 Garki - Abuja.
              </p>
              <p className="text-document-grey font-lexend text-[11px] leading-[13.75px]">
                Annex Office: Suite 411, 4th Floor, MKK Plaza, Gudu District,
                Abuja, FCT, Nigeria.
              </p>
              <p className="text-color-dark-red font-lexend text-[11px] leading-[13.75px]">
                TEL: +2348037809941, +2348057912241
              </p>
            </div>
            <div className="flex items-start justify-end w-[18%] ">
              <img
                src={"/nigeriacoatofarms.png"}
                alt="Abuja Logo"
                className="w-[70px]"
              />
            </div>
          </div>
          {/* 2ND SECTION */}
          <div className="flex flex-col w-full space-y-1 border rounded border-custom-color-one">
            <div className="flex items-center justify-between p-1 rounded-t bg-document-bg-grey">
              <p className="text-document-grey font-lexend text-[11px] font-bold leading-[13.75px] w-[50%]">
                Demand Notice is hereby given to
              </p>
              <p className="text-document-grey text-right font-lexend text-[11px] leading-[13.75px] w-[50%]">
                {demandInvoiceData.Occupant}
              </p>
            </div>
            <div className="flex items-center justify-center gap-1 p-1">
              <div className="flex flex-col items-start space-y-1 font-lexend w-[70%]">
                <p className="text-document-grey text-right font-lexend text-[11px] leading-[13.75px]">
                  In respect of the property below:
                </p>
                {demandInvoiceData.propertyData.map((item, index) => (
                  <div
                    key={index}
                    className="flex w-full items-center justify-start text-metal font-lexend text-[11px] leading-[13.75px]"
                  >
                    <p className="text-left font-bold w-[30%]">{item.label}</p>
                    <p className="text-left w-[5%]">:</p>
                    <p className="text-left text-wrap w-[60%]">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center justify-center space-y-1 bg-white w-[30%]">
                <QRCode
                  size={256}
                  style={{ height: "auto", maxWidth: "72px", width: "100%" }}
                  value={demandInvoiceData.PropertyIdentificationNumber}
                />
                <p className="text-color-dark-red text-center font-mulish font-bold italic text-[11px] leading-[13.75px]">
                  {demandInvoiceData.PropertyIdentificationNumber}
                </p>
              </div>
            </div>
          </div>
          {/* 4TH SECTION */}
          <div className="flex flex-col w-full space-y-1 border rounded border-custom-color-one">
            <div className="flex p-1">
              <div className="flex flex-col items-start space-y-1 w-[100%]">
                <div className="flex flex-col pb-2 space-y-1">
                  <b className="font-lexend text-[10px] text-document-grey leading-[12.5px]">
                    Kindly make payment to the account details below.
                  </b>
                  <p className="font-lexend text-[10px] text-document-grey leading-[12.5px]">
                    Transaction Status:{" "}
                    <b>
                      {paymentAccount?.response_message ||
                        "Transaction in Progress"}
                    </b>
                  </p>
                  <b className="font-lexend text-[10px] leading-[12.5px] text-color-dark-red">
                    Note: The transaction session will expire in 1 hour at
                    exactly {paymentAccount?.expiry_date}.
                  </b>
                </div>
                <p className="font-lexend text-[10px] text-document-grey leading-[12.5px]">
                  Payment Amount:{" "}
                  <b className="font-bold">
                    {formatNumberWithCommas(paymentAccount?.amount || 1000000)}
                  </b>
                </p>
                <p className="font-lexend text-[10px] text-document-grey leading-[12.5px]">
                  Payment Account:{" "}
                  <b>
                    Abuja Municipal Area Council.{" "}
                    {paymentAccount?.bank_name || "Access Bank"}.{" "}
                    {paymentAccount?.account_number || "1226435117"}
                  </b>
                </p>
                <p className="font-lexend text-[10px] text-document-grey leading-[12.5px]">
                  Payment Options:
                </p>

                <div className="flex items-start justify-center gap-1 font-lexend text-[10px] text-document-grey leading-[12.5px]">
                  <span>1.</span>
                  <p>Internet Banking Transfer.</p>
                </div>
                <p className="flex items-start justify-center gap-1 font-lexend text-[10px] text-document-grey leading-[12.5px]">
                  <span>2.</span>
                  <span>Mobile Banking App.</span>
                </p>
                <p className="flex items-start justify-center gap-1 font-lexend text-[10px] text-document-grey leading-[12.5px]">
                  <span>3.</span>
                  <span>USSD.</span>
                </p>
                <p className="flex items-start justify-center gap-1 font-lexend text-[10px] text-document-grey leading-[12.5px]">
                  <span>4.</span>
                  <span>AMAC Bank Draft</span>
                </p>
                <b className="flex items-start justify-center gap-1 font-lexend text-[10px] leading-[12.5px] text-color-dark-red">
                  To avoid doubts, ensure you write your PID as Payment
                  Reference for Internet/Mobile Tranfers and Bank Drafts.
                </b>
                <b className="font-lexend text-[10px] text-document-grey leading-[12.5px]">
                  Payment(s) made to locations(s) other than as prescribed here
                  shall be treated as invalid.
                </b>
              </div>
            </div>
          </div>
          {/* 6TH SECTION */}
          <p className="font-semibold text-[10px] leading-[11px] text-document-grey  text-center font-red-hat">
            <span className="font-bold text-color-dark-red">NOTE:</span> Ensure
            you collect Electronic and Transfer reciepts(s) at Annex Office:
            Suite 411, 4th Floor MKK, Plaza Gudu.
          </p>
        </div>
      ) : null}
      {/* PDF END*/}
    </div>
  );
};

export default Payment;
