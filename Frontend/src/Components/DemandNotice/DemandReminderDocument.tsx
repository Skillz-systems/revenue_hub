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
  demandNotice,
  hideDemandInvoiceModal,
}: {
  customTableData?: any;
  demandInvoiceInfo?: DemandNotice;
  demandNotice?: any;
  hideDemandInvoiceModal: () => any;
}) => {
  const [loading, setLoading] = useState<string>("");
  const demandInvoiceData = {
    Occupant: `THE OCCUPIER/${customTableData?.pid ||
      customTableData?.property.pid ||
      demandInvoiceInfo?.property.pid
      }`,
    PropertyIdentificationNumber: `PID-${customTableData?.pid ||
      customTableData?.property.pid ||
      demandInvoiceInfo?.property.pid
      }`,
    QrCodePayment: `{https://revenuehub.ng/invoice/${customTableData?.pid ||
      customTableData?.property.pid ||
      demandInvoiceInfo?.property.pid
      }`,
    propertyData: [
      {
        label: "Name of Occupier",
        value: `${customTableData?.occupant ||
          customTableData?.property?.occupant ||
          demandInvoiceInfo?.property?.occupant
          }`,
      },
      { label: "Assessment No", value: "AM/B12/TTR/2016/0400" },
      {
        label: "Property Address",
        value:
          customTableData?.prop_addr ||
          customTableData?.property.prop_addr ||
          demandInvoiceInfo?.property.prop_addr,
      },
      {
        label: "Cadestral Zone",
        value:
          customTableData?.cadastral_zone ||
          customTableData?.property.cadastral_zone ||
          demandInvoiceInfo?.property.cadastral_zone,
      },
      {
        label: "Use of Property",
        value:
          customTableData?.prop_use ||
          customTableData?.property.prop_use ||
          demandInvoiceInfo?.property.prop_use,
      },
      {
        label: "Rating District",
        value:
          customTableData?.rating_dist ||
          customTableData?.property.rating_dist ||
          demandInvoiceInfo?.property.rating_dist,
      },
    ],
    billInfoData: [
      {
        label: "Bill Ref",
        value: `2025/${customTableData?.id || demandInvoiceInfo?.id}`,
      },
      { label: "Agency Code", value: 2000300 },
      { label: "Revenue Code", value: 1002 },
      { label: "Rate Year", value: 2025 },
    ],
    billDetailsData: [
      {
        label: "Annual Value",
        value:
          customTableData?.annual_value ||
          customTableData?.property.annual_value ||
          demandInvoiceInfo?.property.annual_value,
      },
      {
        label: "Rate Payable",
        value:
          customTableData?.rate_payable ||
          customTableData?.property.rate_payable ||
          demandInvoiceInfo?.property.rate_payable,
      },
      {
        label: "Arrears Year",
        value:
          demandNotice?.arrears_amount ||
          customTableData?.arrears_amount ||
          demandInvoiceInfo?.arrears_amount,
      },
      {
        label: "Penalty (10%)",
        value:
          demandNotice?.penalty ||
          customTableData?.penalty ||
          demandInvoiceInfo?.penalty,
      },
      // {
      //   label: "Grand Total",
      //   value: (
      //     parseFloat(
      //       customTableData?.rate_payable?.replace(/,/g, "") ||
      //         customTableData?.property?.rate_payable?.replace(/,/g, "") ||
      //         demandInvoiceInfo?.property?.rate_payable?.replace(/,/g, "") ||
      //         "0"
      //     ) +
      //     parseFloat(
      //       demandNotice?.arrears_amount?.replace(/,/g, "") ||
      //         customTableData?.arrears_amount?.replace(/,/g, "") ||
      //         demandInvoiceInfo?.arrears_amount?.replace(/,/g, "") ||
      //         "0"
      //     ) +
      //     parseFloat(
      //       demandNotice?.penalty?.replace(/,/g, "") ||
      //         customTableData?.penalty?.replace(/,/g, "") ||
      //         demandInvoiceInfo?.penalty?.replace(/,/g, "") ||
      //         "0"
      //     )
      //   ).toFixed(2),
      //   isTotal: true,
      // },
      {
        label: "Grand Total",
        value:
          demandNotice?.amount ||
          customTableData?.amount ||
          demandInvoiceInfo?.amount,
        isTotal: true,
      },
    ],
  };

  const pdfRef = useRef<HTMLDivElement>(null);

  const downloadEmailPrintPDF = async (operation: string) => {
    const paddingSections = document.querySelectorAll(".printPaddingBottom");
    paddingSections.forEach((section) => section.classList.add("pb-4"));

    const officalParentSection = document.querySelectorAll(
      ".officialStyleParent"
    );
    officalParentSection.forEach((section) =>
      section.classList.add("space-y-3")
    );

    const officalChildSection = document.querySelectorAll(
      ".officialStyleParent"
    );
    officalChildSection.forEach((section) => section.classList.add("pb-6"));

    const firstInput = pdfRef.current;
    if (!firstInput) return;

    try {
      const options = {
        scale: 2, // Increase the scale for better quality
        useCORS: true, // Allow cross-origin images
      };

      const firstCanvas = await html2canvas(firstInput, options);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [595, 840], // A4 size
        compress: true,
      });

      // Calculate the height of the first canvas dynamically
      const firstInputHeight = firstInput.offsetHeight;
      const imgWidth1 = 595;
      const imgHeight1 =
        (firstInputHeight / firstInput.offsetWidth) * imgWidth1;

      const imgDataFirst = firstCanvas.toDataURL("image/png", 1.0);
      pdf.addImage(imgDataFirst, "WEBP", 0, 0, imgWidth1, 835);
      pdf.addPage();

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
        paddingSections.forEach((section) => section.classList.remove("pb-4"));
        officalParentSection.forEach((section) =>
          section.classList.remove("space-y-4")
        );
        officalChildSection.forEach((section) =>
          section.classList.remove("pb-8")
        );
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
      <div className="flex flex-col py-1 space-y-0.5 officialStyleParent border-b border-custom-color-one printPaddingBottom">
        <p className="text-color-text-two text-[11px] text-center font-lexend leading-[13px]">
          {title}
        </p>
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <p
              className={`text-metal pl-2 officialStyleChild mb-2 font-lexend text-[11px] leading-[13px] font-medium ${item.width}`}
            >
              {item.label}:
            </p>
            <div className="w-[60%] px-1.5 py-1 mr-2 border-b border-dashed border-b-custom-teal"></div>
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
      <div className="flex flex-col items-center w-full printPaddingBottom2">
        <img
          src={signature}
          className="w-[90px] h-[40px] object-contain"
          alt="Signature"
        />
        <div className="flex flex-col items-center w-full p-2 font-bold border-t font-mulish text-dark-green border-t-dark-green">
          <p className="text-[11px] leading-[13px] text-center">{title}</p>
          <p className="text-[9px] text-document-grey pt-1 italic text-center leading-[11px] w-[80%]">
            {subtitle}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full items-center py-2 space-y-2 bg-white md:w-[60%] lg:w-[50%] h-[95vh] rounded print:w-[100%] print:h-[auto]">
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

      <div className="w-full overflow-auto sm:w-auto overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white">
        <div
          ref={pdfRef}
          className="bg-white print-section flex flex-col items-center justify-center px-4 py-4 space-y-4 w-[100%]"
        >
          {/* 1ST SECTION */}
          <div className="flex items-center justify-center w-full">
            <div className="flex items-start justify-start w-[18%]">
              <img
                src={"/abujalogo.png"}
                alt="Abuja Logo"
                className="w-[55px]"
              />
            </div>
            <div className="flex flex-col text-center w-[64%] ">
              <h1 className="text-sm font-bold leading-[16px] text-primary-color font-work-sans">
                ABUJA MUNICIPAL AREA COUNCIL
              </h1>
              <h2 className="text-[11px] font-bold leading-[13px] text-color-dark-red font-work-sans">
                TENEMENT RATE & VALUATION OFFICE
              </h2>
              <p className="text-document-grey font-lexend text-[11px] leading-[13px]">
                Secreteriat: No 1 Olusegun Obasanjo Way, Area 10 Garki - Abuja.
              </p>
              <p className="text-document-grey font-lexend text-[11px] leading-[13px]">
                Annex Office: Suite 301, 3rd floor Kano House, Ralph Shodeinde
                street, CBD, Abuja
              </p>
              <p className="text-color-dark-red font-lexend text-[11px] leading-[13px]">
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
            <div className="flex items-center justify-between p-1 rounded-t bg-document-bg-grey printPaddingBottom">
              <p className="text-document-grey font-lexend text-[11px] font-bold leading-[13px] w-[50%]">
                Tenement Rate Reminder Notice is hereby given to
              </p>
              <p className="text-document-grey text-right font-lexend text-[11px] leading-[13px] w-[50%]">
                {demandInvoiceData.Occupant}
              </p>
            </div>
            <div className="flex items-center justify-center gap-1 p-1 printPaddingBottom">
              <div className="flex flex-col items-start space-y-1 font-lexend w-[70%]">
                <p className="text-document-grey text-right font-lexend text-[11px] leading-[13px]">
                  In respect of the property below:
                </p>
                {demandInvoiceData.propertyData.map((item, index) => (
                  <div
                    key={index}
                    className="flex w-full items-center justify-start text-metal font-lexend text-[11px] leading-[13px]"
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
                <p className="text-color-dark-red text-center font-mulish font-bold italic text-[11px] leading-[13px]">
                  {demandInvoiceData.PropertyIdentificationNumber}
                </p>
              </div>
            </div>
          </div>
          {/* 2ND SECTION */}
          <div className="flex flex-col w-full space-y-1 border rounded border-custom-color-one">
            <p className="text-[11px] p-1 font-lexend font-medium text-metal leading-[12.5px]">
              THE OCCUPIER {demandInvoiceData.propertyData[2].value}.
            </p>
            <p className="text-[11px] p-1 font-lexend font-medium text-metal leading-[12.5px]">
              The Management of Abuja Municipal Area Council; Tenement Rate &
              Valuation Department wishes to remind you on the pending demand of
              Tenement Rate & Valuation levy/fees dues to Abuja municipal Area
              Council. This is inspite of having allowed you ample amount of
              time to pay the fees/levy of the sum{" "}
              <span className=" text-color-dark-red">
                NGN
                {formatNumberWithCommas(
                  demandInvoiceData.billDetailsData[4].value
                )}
                .
              </span>{" "}
            </p>
            <p className="text-[11px] p-1 font-lexend font-medium text-metal leading-[12.5px]">
              You are therefore required to settle the bill/levy within One Week
              from the date of this notice, otherwise Abuja Municipal Area
              Council Tenement Rate & Valuation Authority may have no choice
              other than to enforce full payment of the bill/levy in accordance
              with the provision of section 7 (4th schedule) of the 1999
              constitution of the Federal Republic of Nigeria, Federal Capital
              Territory Act cap 503, LFN 200 (Vol.3) as amended: Taxes and
              levies (approved list of collection) Act 2015 (as amended) and
              AMAC Tenement Rent bye-laws of 2012.
            </p>
            <p className="text-[11px] p-1 font-lexend font-medium text-metal leading-[12.5px] border-b border-custom-color-one pb-2 printPaddingBottom">
              <span className="text-color-dark-red">NOTE:</span> We forwarded
              your bill for the year 2025, totalling{" "}
              <span className=" text-color-dark-red">
                NGN
                {formatNumberWithCommas(
                  demandInvoiceData.billDetailsData[4].value
                )}
                .
              </span>{" "}
              in respect of the landed property(ies) you are occupying in Abuja
              Municipal Area Council as per detail above
            </p>
            <div className="flex p-1 printPaddingBottom">
              <div className="flex flex-col items-start space-y-1 w-[80%]">
                <p className="font-lexend text-[11px] text-document-grey leading-[12.5px]">
                  How to make payment:
                </p>
                <div className="flex items-start justify-center gap-1 font-lexend text-[11px] text-document-grey leading-[12.5px]">
                  <span>1.</span>
                  <span>Walk into any of your bank branches</span>
                </div>
                <p className="flex items-start justify-center gap-1 font-lexend text-[11px] text-document-grey leading-[12.5px]">
                  <span>2.</span>
                  <span>
                    Inform the teller that you want to make a NIBSS e-bills payment for AMAC Zone A & C tenement.
                  </span>
                </p>
                <p className="flex items-start justify-center gap-1 font-lexend text-[11px] text-document-grey leading-[12.5px]">
                  <span>3.</span>
                  <span>Use property number ({demandInvoiceData.PropertyIdentificationNumber})</span>
                </p>
                <p className="font-lexend text-[11px] text-document-grey leading-[12.5px]">
                  Payment(s) made to locations(s) other than as prescribed here shall be treated as invalid.
                </p>
              </div>
              {/* <div className="flex flex-col space-y-2 items-center w-[20%]">
                <QRCode
                  size={256}
                  style={{ height: "auto", maxWidth: "64px", width: "100%" }}
                  value={demandInvoiceData.QrCodePayment}
                />
                <p className="text-color-text-one font-lexend font-bold text-[9px] leading-[11px]">
                  {demandInvoiceData.PropertyIdentificationNumber}
                </p>
              </div> */}
            </div>
          </div>
          {/* 3RD SECTION */}
          <div className="flex items-start w-full">
            <p className="text-left text-document-grey text-[9px] font-lexend">
              Your early compliance will be highly appreciated
            </p>
          </div>
          <div className="flex items-center justify-between w-full gap-6">
            <div className="flex flex-col w-[50%] items-start justify-between officialStyleParent">
              <ChairmanSection
                title="DIRECTOR OF OPERATIONS"
                subtitle="For Honourable Chairman Abuja Municipal Area Council"
                signature={images.signature2}
              />
              <ChairmanSection
                title="HEAD OF ENFORCEMENT AND REVENUE RECOVERY"
                subtitle="For Honourable Chairman Abuja Municipal Area Council"
                signature={images.signature1}
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
          {/* 4TH SECTION */}
          <p className="font-medium text-[9px] leading-[11px] text-faint-grey text-center font-red-hat">
            <span className="font-bold text-color-dark-red">NOTE:</span> Ensure
            you collect Electronic and Treasury reciepts(s) at Annex Office:
            Suite 301, 3rd floor, Kano House, Ralph Shodeinde Street, Central
            Business District, Abuja, FCT.
          </p>
        </div>

        <div className="page-break"></div>
      </div>

      {/* 5TH SECTION */}
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
