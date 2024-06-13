import React, { useState, useRef } from "react";
// import { TbCurrencyNaira } from "react-icons/tb";
import { LiaDownloadSolid } from "react-icons/lia";
// import { TfiEmail } from "react-icons/tfi";
import { HiOutlinePrinter } from "react-icons/hi2";
import { MdCancel } from "react-icons/md";
import QRCode from "react-qr-code";
// import { CustomAlert } from "../Index";
import { formatNumberWithCommas } from "../../Utils/client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DemandNotice } from "../../Data/types";
import "../../print.css";
import images from "../../assets/index";

interface SectionProps {
  title: string;
  data: { label: string; width?: string }[];
}

const DemandInvoiceDocument = ({
  customTableData,
  demandInvoiceInfo,
  hideDemandInvoiceModal,
}: {
  customTableData?: any;
  demandInvoiceInfo?: DemandNotice;
  hideDemandInvoiceModal: () => any;
}) => {
  const [loading, setLoading] = useState<string>("");
  const demandInvoiceData = {
    Occupant: `THE OCCUPIER/${
      customTableData?.pid || demandInvoiceInfo?.property.pid
    }`,
    PropertyIdentificationNumber: `PID-${
      customTableData?.pid || demandInvoiceInfo?.property.pid
    }`,
    QrCodePayment: `{https://revenuehub.com/invoice/${
      customTableData?.pid || demandInvoiceInfo?.property.pid
    }`,
    propertyData: [
      {
        label: "Name of Occupier",
        value: `${
          customTableData?.occupant || demandInvoiceInfo?.property?.occupant
        }`,
      },
      { label: "Assessment No", value: "AM/B12/TTR/2016/0400" },
      {
        label: "Property Address",
        value:
          customTableData?.prop_addr || demandInvoiceInfo?.property.prop_addr,
      },
      {
        label: "Cadestral Zone",
        value:
          customTableData?.cadastral_zone ||
          demandInvoiceInfo?.property.cadastral_zone,
      },
      {
        label: "Use of Property",
        value:
          customTableData?.prop_use || demandInvoiceInfo?.property.prop_use,
      },
      {
        label: "Rating District",
        value:
          customTableData?.rating_dist ||
          demandInvoiceInfo?.property.rating_dist,
      },
    ],
    billInfoData: [
      {
        label: "Bill Ref",
        value: `2024/${customTableData?.id || demandInvoiceInfo?.id}`,
      },
      { label: "Agency Code", value: 2000300 },
      { label: "Revenue Code", value: 1002 },
      { label: "Rate Year", value: 2024 },
    ],
    billDetailsData: [
      {
        label: "Annual Value",
        value:
          customTableData?.annual_value ||
          demandInvoiceInfo?.property.annual_value,
      },
      {
        label: "Rate Payable",
        value:
          customTableData?.rate_payable ||
          demandInvoiceInfo?.property.rate_payable,
      },
      {
        label: "Arrears Year",
        value: customTableData?.arrears || demandInvoiceInfo?.arrears_amount,
      },
      {
        label: "Penalty (10%)",
        value: customTableData?.penalty || demandInvoiceInfo?.penalty,
      },
      {
        label: "Grand Total",
        value:
          customTableData?.grand_total ||
          demandInvoiceInfo?.property.grand_total,
        isTotal: true,
      },
    ],
  };

  const pdfRef = useRef<HTMLDivElement>(null);
  const secondPdfRef = useRef<HTMLDivElement>(null);

  const downloadEmailPrintPDF = async (operation: string) => {
    const firstInput = pdfRef.current;
    const secondInput = secondPdfRef.current;
    if (!firstInput || !secondInput) return;

    try {
      const firstCanvas = await html2canvas(firstInput);
      const secondCanvas = await html2canvas(secondInput);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [595, 842], // A4 size
        compress: true,
      });

      const imgDataFirst = firstCanvas.toDataURL("image/png");
      pdf.addImage(imgDataFirst, "WEBP", 0, 0, 595, 835);

      // Calculate the height of the second canvas dynamically
      const secondInputHeight = secondInput.offsetHeight;
      const imgWidth = 595;
      const imgHeight =
        (secondInputHeight / secondInput.offsetWidth) * imgWidth;

      pdf.addPage();
      const imgDataSecond = secondCanvas.toDataURL("image/webp");
      pdf.addImage(imgDataSecond, "WEBP", 0, 0, imgWidth, imgHeight);

      if (operation === "download") {
        pdf.save(
          `demand_invoice_${demandInvoiceData.PropertyIdentificationNumber}.pdf`
        );
      } else if (operation === "print") {
        const otherSections = document.querySelectorAll(".hide-on-print");
        otherSections.forEach((section) => section.classList.add("hidden"));
        pdf.autoPrint();
        window.open(pdf.output("bloburl"), "_blank");
        otherSections.forEach((section) => section.classList.remove("hidden"));
      } else {
        console.error("Invalid operation:", operation);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
    setLoading("");
  };

  const acknowledgementData: { label: string; width: string }[] = [
    { label: "Name", width: "w-[100px]" },
    { label: "Date", width: "w-[100px]" },
    { label: "Signature", width: "w-[100px]" },
    { label: "Phone Number", width: "w-[100px]" },
  ];

  const officialUseData: { label: string; width: string }[] = [
    { label: "Date of Dispatch", width: "w-[120px]" },
    { label: "Name of Officer", width: "w-[120px]" },
    { label: "Mode of Dispatch", width: "w-[120px]" },
  ];

  const SectionDetails: React.FC<SectionProps> = ({ title, data }) => {
    return (
      <div className="flex flex-col py-2 space-y-1 border-b border-custom-color-one">
        <p className="text-color-text-two text-[11px] text-center font-lexend leading-[13.75px]">
          {title}
        </p>
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <p
              className={`text-metal pl-2 font-lexend text-[11px] leading-[13.75px] font-medium ${item.width}`}
            >
              {item.label}:
            </p>
            <div className="w-[60%] p-1.5 mr-2 border-b border-dashed border-b-custom-teal"></div>
          </div>
        ))}
      </div>
    );
  };

  const ChairmanSection: React.FC<{
    title: string;
    subtitle: string;
    signature: string;
  }> = ({ title, subtitle, signature }) => {
    return (
      <div className="flex flex-col items-center w-full">
        <img
          src={signature}
          className="w-[82px] h-[35px] object-contain"
          alt="Signature"
        />
        <div className="flex flex-col items-center w-full p-2 font-bold border-t font-mulish text-dark-green border-t-dark-green">
          <p className="text-[11px] leading-[13.75px] text-center">{title}</p>
          <p className="text-[8px] text-document-grey pt-1 italic text-center leading-[10px] w-[80%]">
            {subtitle}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center py-2 space-y-2 bg-white w-[50%] h-[95vh] rounded print:w-[100%] print:h-[auto]">
      <div className="flex justify-end w-full px-4 hide-on-print">
        <span
          className="flex items-center justify-center px-0.5 w-[24px] h-[24px] text-xs text-color-dark-red border border-color-dark-red rounded hover:cursor-pointer"
          title="Close Modal"
          onClick={hideDemandInvoiceModal}
        >
          <MdCancel />
        </span>
      </div>
      {/* PDF START*/}

      <div className="overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white">
        <div
          ref={pdfRef}
          className="bg-white print-section flex flex-col items-center justify-center px-4 py-2 space-y-2 w-[100%] border border-custom-color-100 rounded"
        >
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
          {/* 3RD SECTION */}
          <div className="flex items-center justify-between w-full gap-2">
            <div className="flex flex-col space-y-3 w-[50%]">
              <p className="text-color-text-two text-left font-lexend text-[11px] leading-[13.75px] ">
                BILL INFORMATION
              </p>
              <div className="flex flex-col space-y-1 border rounded border-custom-color-100">
                {demandInvoiceData.billInfoData.map((item, index) => (
                  <div
                    key={index}
                    className="flex p-1 text-metal font-lexend text-[11px] leading-[13.75px]"
                  >
                    <p className="font-medium text-left w-[50%]">
                      {item.label} :
                    </p>
                    <p className="font-bold text-primary-color">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col space-y-1 border rounded border-custom-color-100 w-[50%]">
              {demandInvoiceData.billDetailsData.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center p-1 text-metal font-lexend text-[11px] leading-[13.75px] ${
                    item.isTotal ? "py-2 bg-custom-blue-100 rounded-b" : ""
                  }`}
                >
                  <p className="font-medium text-left w-[130px]">
                    {item.label} :
                  </p>
                  <p className="flex items-center justify-center font-bold text-primary-color">
                    <span className="mr-1 text-xs text-color-bright-green">
                      ₦
                    </span>
                    <span>{`${formatNumberWithCommas(item.value)}.00`}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* 4TH SECTION */}
          <div className="flex flex-col w-full space-y-1 border rounded border-custom-color-one">
            <p className="text-[10px] p-1 font-lexend font-light leading-[12.5px] text-document-grey border-b border-custom-color-one pb-2">
              In accordance with the provision of section 7 (4th Schedule) of
              the 1999 constitution of the Federal Republic Of Nigeria; Federal
              Capital Territory Act Cap 503, LPN 2004 (vol. 3) as amended: Taxes
              and Levies (Approved list of Collection ) Act 2015 (as amended and
              AMAC Tenement Rate bye-Laws of 2014. We forwarded herewith your
              bill for the year 2024, totaling{" "}
              <span className="font-normal text-color-dark-red">
                NGN
                {formatNumberWithCommas(
                  demandInvoiceData.billDetailsData[4].value
                )}
              </span>{" "}
              in respect of the landed property (ies) you are occupying in Abuja
              Municipal Area Council as per details above.
            </p>
            <div className="flex p-1">
              <div className="flex flex-col items-start space-y-1 w-[80%]">
                <p className="font-lexend text-[10px] text-document-grey leading-[12.5px]">
                  Payment Options:
                </p>
                <div className="flex items-start justify-center gap-1 font-lexend text-[10px] text-document-grey leading-[12.5px]">
                  <span>1.</span>
                  <p>
                    Internet Banking Transfer:{" "}
                    <b>
                      <a
                        href={`/invoice/${
                          customTableData?.pid ||
                          demandInvoiceInfo?.property.pid
                        }`}
                        target="_blank"
                        className="underline text-color-dark-red"
                      >
                        https://revenuehub.com/invoice/
                        {customTableData?.pid ||
                          demandInvoiceInfo?.property.pid}
                      </a>
                    </b>
                  </p>
                </div>
                <p className="flex items-start justify-center gap-1 font-lexend text-[10px] text-document-grey leading-[12.5px]">
                  <span>2.</span>
                  <span>
                    Pay by Scanning the QRCode on the right hand which will
                    redirect you to the your unique payment page.
                  </span>
                </p>
                <p className="flex items-start justify-center gap-1 font-lexend text-[10px] text-document-grey leading-[12.5px]">
                  <span>3.</span>
                  <span>AMAC Bank Draft.</span>
                </p>
                <p className="flex items-start justify-center gap-1 font-lexend text-[10px] leading-[12.5px]">
                  <span className="text-document-grey">4.</span>
                  <span className="text-color-dark-red">
                    To avoid doubts, write your PID as Payment Reference for
                    bank branch and Transfers.
                  </span>
                </p>
                <p className="font-lexend text-[10px] text-document-grey leading-[12.5px]">
                  Payment(s) made to locations(s) other than as prescribed here
                  shall be treated as invalid.
                </p>
              </div>
              <div className="flex flex-col space-y-2 items-center w-[20%]">
                <QRCode
                  size={256}
                  style={{ height: "auto", maxWidth: "64px", width: "100%" }}
                  value={demandInvoiceData.QrCodePayment}
                />
                <p className="text-color-text-one font-lexend font-bold text-[8px] leading-[10px]">
                  {demandInvoiceData.PropertyIdentificationNumber}
                </p>
              </div>
            </div>
          </div>
          {/* 5TH SECTION */}
          <div className="flex items-center justify-between w-full gap-6">
            <div className="flex flex-col space-y-1 w-[50%]">
              <p className="text-document-grey text-[8px] font-lexend leading-[10px]">
                Your early compliance will be highly appreciated
              </p>
              <ChairmanSection
                title="HEAD OF TENEMENT RATE"
                subtitle="For Honourable Chairman Abuja Municipal Area Council"
                signature={images.signature1}
              />
              <ChairmanSection
                title="DIRECTOR OF OPERATIONS"
                subtitle="For Honourable Chairman Abuja Municipal Area Council"
                signature={images.signature2}
              />
            </div>
            <div className="flex flex-col border border-custom-color-one rounded w-[50%]">
              <SectionDetails
                title="ACKNOWLEDGEMENT"
                data={acknowledgementData}
              />
              <SectionDetails
                title="FOR OFFICIAL USE ONLY"
                data={officialUseData}
              />
            </div>
          </div>
          {/* 6TH SECTION */}
          <p className="font-medium text-[8px] leading-[11px] text-faint-grey text-center font-red-hat">
            <span className="font-bold text-color-dark-red">NOTE:</span> Ensure
            you collect Electronic and Treasury reciepts(s) at Annex Office:
            Suite 411, 4th Floor MKK, Plaza Gudu.
          </p>
        </div>

        <div className="page-break"></div>

        <div
          ref={secondPdfRef}
          className="bg-white print-section flex flex-col px-4 py-2 space-y-2 w-[100%] border border-custom-color-100 rounded"
        >
          {/* 7TH SECTION */}
          <div className="flex flex-col w-full p-1 border rounded font-lexend border-custom-color-one">
            <h3 className="text-center text-[12px] text-metal font-semibold">
              Notes:
            </h3>
            <div className="flex flex-col flex-wrap w-full h-auto">
              <p className="flex items-start just gap-1 text-[11px] text-metal leading-[18px]">
                <span>1.</span>
                <span>
                  Primary Liability lies on the occupier, while owner/agent of
                  such tenement(s) shall be secondarily liable.
                </span>
              </p>
              <p className="flex items-start just gap-1 text-[11px] text-metal leading-[18px]">
                <span>2.</span>
                <span>
                  Failure to pay Tenement Rate is a punishable offence and upon
                  conviction be liable to a fine equivalent to the sum owed or
                  imprisonment for six (6) months and "POSSIBLY SEAL-OFF" of the
                  premises in accordance with the law.
                </span>
              </p>
              <p className="flex items-start just gap-1 text-[11px] text-metal leading-[18px]">
                <span>3.</span>
                <span>Your prompt payment is hereby solicited.</span>
              </p>
            </div>
          </div>
          {/* 8TH SECTION */}
          <div className="flex flex-col w-full p-1 font-lexend text-[11px] text-metal leading-[18px]">
            <b>
              It is illegal to pay cash to anyone EXCEPT through the payment
              options as specified.
            </b>
            <p>
              All payment(s) should be made in full using the specifed payment
              options not <b className="underline">later than (21) days</b> from
              the date this <b>DEMAND NOTICE</b> is served on you.
            </p>
          </div>
          {/* 9TH SECTION */}
          <div className="flex flex-col w-full p-1 border rounded font-lexend border-custom-color-one">
            <h3 className="text-center text-[12px] text-metal font-semibold">
              HOW TO ASSESS YOUR PROPERTY:
            </h3>
            <div className="flex flex-col flex-wrap w-full h-auto">
              <p className="flex items-start gap-1 text-[11px] text-metal leading-[18px]">
                <span>1.</span>
                <span>
                  Note that RATE NAIRAGE is 4 Kobo for every 100 Kobo;
                  therefore, your <b>RATE PAYABLE</b> will be{" "}
                  <b>ANNUAL VALUE * 0.04.</b>
                </span>
              </p>
              <p className="flex items-start just gap-1 text-[11px] text-metal leading-[18px]">
                <span>2.</span>
                <span>
                  <b>PENALTY ON ARREARS</b> is calculated at the rate of 10% of
                  any outstanding arrears.
                </span>
              </p>
            </div>
          </div>
          {/* 10TH SECTION */}

          <div className="flex flex-col w-full p-1 border rounded font-lexend border-custom-color-one">
            <b className="text-[11px] text-metal leading-[18px]">
              Note: A change of the use of property from residential to
              commericial without notifying the council in writing shall attract
              a penalty of ₦5,000,000.000
            </b>
          </div>
        </div>
      </div>

      {/* 11TH SECTION */}
      <div className="flex flex-col items-center justify-end flex-1 w-full hide-on-print">
        <div className="flex items-end justify-center w-full gap-6 p-2">
          <span
            className="flex items-center px-1 justify-center gap-1 font-lexend max-w-max text-primary-color text-xl bg-white border border-custom-color-one rounded h-[32px] hover:cursor-pointer"
            title="Download"
            onClick={() => {
              setLoading("download");
              downloadEmailPrintPDF("download");
            }}
          >
            <LiaDownloadSolid />
            {loading === "download" ? (
              <span className="text-xs">Dowloading...</span>
            ) : null}
          </span>
          <span
            className="flex px-4 py-2.5 gap-1 font-lexend text-xs text-white items-center justify-center bg-primary-color border border-custom-color-one rounded h-[32px] hover:cursor-pointer"
            title="Print"
            onClick={() => {
              setLoading("print");
              downloadEmailPrintPDF("print");
            }}
          >
            <span className="text-xl">
              <HiOutlinePrinter />
            </span>
            {loading === "print" ? "Preparing Document..." : "Print"}
          </span>
        </div>
      </div>
      {/* PDF END*/}
    </div>
  );
};

export default DemandInvoiceDocument;
