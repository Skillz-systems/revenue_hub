import React, { useState } from "react";
import { useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import { formatNumberWithCommas, useTriggerError } from "../Utils/client";
import axios, { AxiosError } from "axios";
import images from "../assets";
import { CustomAlert } from "../Components/Index";

const apiUrl = import.meta.env.VITE_API_URL as string;

const Payment = () => {
  const { pid } = useParams();
  const [paymentAccount, setPaymentAccount] = useState<any>(null);
  const [isButtonClicked, setIsButtonClicked] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const triggerError = useTriggerError();

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const generatePaymentDetails = async () => {
    try {
      setSnackbar({
        open: true,
        message: `Generating Payment Information for PID-${pid}...`,
        severity: "info",
      });
      const response = await axios.get(
        `${apiUrl}/api/payment/generate-account/${pid}`
      );
      if (response.status === 200) {
        setPaymentAccount(response.data);
        setSnackbar({
          open: true,
          message: `Successfuly generated payment information for customer with PID-${pid}`,
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message:
            "Unexpected status code. Something went wrong please try again.",
          severity: "warning",
        });
      }
    } catch (error: any) {
      let message = "Internal Server Error";
      if (error.isAxiosError) {
        const axiosError = error as AxiosError;
        if (axiosError.code === "ERR_NETWORK") {
          message =
            "Network error. Please check your internet connection and try again.";
        } else if (axiosError.response) {
          switch (axiosError.response.status) {
            case 400:
              message = "Bad request. Property Id is missing.";
              break;
            case 401:
              message = "You are unauthorized";
              break;
            case 403:
              message = "You are forbidden";
              break;
            case 404:
              message = "Payment not found";
              break;
            case 429:
              message = "Too many requests made. Refreshing in 3 seconds";
              setTimeout(() => {
                window.location.reload();
              }, 3000);
              break;
            case 500:
              triggerError(error);
              break;
            default:
              break;
          }
        }
      }
      setIsButtonClicked(false);
      setSnackbar({ open: true, message, severity: "error" });
    }
  };

  const demandInvoiceData = {
    Occupant: `THE OCCUPIER/${pid}`,
    PropertyIdentificationNumber: `PID-${pid}`,
    QrCodePayment: "3191313-0482402470",
    propertyData: [
      { label: "Name of Occupier", value: paymentAccount?.property.occupant },
      { label: "Assessment No", value: "AM/B12/TTR/2016/0400" },
      {
        label: "Property Address",
        value: paymentAccount?.property.prop_addr,
      },
      {
        label: "Cadestral Zone",
        value: paymentAccount?.property.cadastral_zone,
      },
      {
        label: "Use of Property",
        value: paymentAccount?.property.prop_use,
      },
      {
        label: "Rating District",
        value: paymentAccount?.property.rating_dist,
      },
    ],
  };
  return (
    <div
      className={`flex flex-col items-center ${
        !paymentAccount ? "justify-center" : "justify-start"
      } py-4 px-4 space-y-2 bg-white w-[100%] h-[100vh] rounded`}
    >
      {/* PDF START*/}
      {!paymentAccount ? (
        <div className="flex flex-col items-center justify-center space-y-4 w-[85%] sm:w-[75%] md:w-[50%]">
          <h1 className="text-center font-lexend text-color-text-black">
            You are about to make payment for your AMAC Tenement Rate for
            Property with <b>PID-{pid}</b>.
          </h1>
          <div className="flex flex-col items-center justify-center space-y-8 max-w-[300px] bg-white border border-grey rounded shadow-md px-4 py-4">
            <img
              src={images.logo}
              alt="Logo"
              className="w-[8rem] sm:w-40 md:w-[150px]"
            />
            <button
              className={`flex items-center justify-center gap-2 px-3 py-2 text-white text-[0.875rem] md:text-[1rem] rounded bg-primary-color font-lexend ${
                isButtonClicked ? "opacity-90" : ""
              }`}
              onClick={() => {
                generatePaymentDetails();
                setIsButtonClicked(true);
              }}
              disabled={isButtonClicked}
            >
              {isButtonClicked ? (
                <svg
                  aria-hidden="true"
                  className="inline w-5 h-5 text-white animate-spin dark:text-white fill-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              ) : null}
              {isButtonClicked
                ? "Generating Payment"
                : "Proceed to make payment"}
            </button>
          </div>
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
                Annex Office: Suite 301, 3rd floor Kano House, Ralph Shodeinde
                street, CBD, Abuja
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
            <div className="flex items-center justify-center gap-2 p-1 md:gap-1">
              <div className="flex flex-col items-start space-y-1 font-lexend w-[80%] md:w-[70%]">
                <p className="text-document-grey text-right font-lexend text-[11px] leading-[13.75px]">
                  In respect of the property below:
                </p>
                {demandInvoiceData.propertyData.map((item, index) => (
                  <div
                    key={index}
                    className="flex w-full items-center justify-start text-metal font-lexend text-[11px] leading-[13.75px]"
                  >
                    <p className="text-left font-bold w-[40%] md:w-[30%]">
                      {item.label}
                    </p>
                    <p className="text-left w-[5%] md:w-[5%]">:</p>
                    <p className="text-left text-wrap w-[50%] md:w-[60%]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center justify-center space-y-1 bg-white w-[20%] md:w-[30%]">
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
                    <b>{paymentAccount?.data.data.response_message}</b>
                  </p>
                  <b className="font-lexend text-[10px] leading-[12.5px] text-color-dark-red">
                    Note: The transaction session will expire in 1 hour at
                    exactly {paymentAccount?.data.data.expiry_date}.
                  </b>
                </div>
                <p className="font-lexend text-[10px] text-document-grey leading-[12.5px]">
                  Payment Amount:{" "}
                  <b className="font-bold text-[10px] md:text-[12px] text-color-bright-green">
                    {formatNumberWithCommas(paymentAccount?.data.data.amount)}
                  </b>
                </p>
                <p className="font-lexend text-[10px] text-document-grey leading-[12.5px]">
                  Payment Account:{" "}
                  <b className="text-[10px] md:text-[12px] text-color-bright-green">
                    Abuja Municipal Area Council.{" "}
                    {paymentAccount?.data.data.bank_name}.{" "}
                    {paymentAccount?.data.data.account_number}
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
      <CustomAlert
        isOpen={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        handleClose={handleSnackbarClose}
      />
    </div>
  );
};

export default Payment;
