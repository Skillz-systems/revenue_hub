import React, { useRef } from "react";
import { TbCurrencyNaira } from "react-icons/tb";
import { LiaDownloadSolid } from "react-icons/lia";
import { TfiEmail } from "react-icons/tfi";
import { HiOutlinePrinter } from "react-icons/hi2";
import { MdCancel } from "react-icons/md";
import QRCode from "react-qr-code";
import { formatNumberWithCommas } from "../../Utils/client"
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DemandInvoiceDataType } from "../Index";

interface SectionProps {
  title: string;
  data: { label: string; width?: string }[];
}

const DemandInvoiceDocument = ({ customTableData, hideDemandInvoiceModal }: { customTableData: any, hideDemandInvoiceModal: any }) => {
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

  const demandInvoiceData: DemandInvoiceDataType = {
    Occupant: `THE OCCUPIER/${customTableData.personalIdentificationNumber}`,
    PropertyIdentificationNumber: `PID-${customTableData.personalIdentificationNumber}`,
    QrCodePayment: "3191313-0482402470",
    propertyData: [
      { label: "Name of Occupier", value: `${customTableData.occupantInfo[0].firstName} ${customTableData.occupantInfo[0].lastName}` },
      { label: "Assessment No", value: "AM/B12/TTR/2016/0400" },
      {
        label: "Property Address",
        value: customTableData.propertyAddress,
      },
      { label: "Cadestral Zone", value: customTableData.cadestralZone },
      { label: "Use of Property", value: customTableData.propertyUse },
      { label: "Rating District", value: customTableData.ratingDistrict },
    ],
    billInfoData: [
      { label: "Bill Ref", value: "2024/215996" },
      { label: "Agency Code", value: 2000300 },
      { label: "Revenue Code", value: 1002 },
      { label: "Rate Year", value: 2024 },
    ],
    billDetailsData: [
      { label: "Annual Value", value: customTableData.annualValue },
      { label: "Rate Payable", value: customTableData.ratePayable },
      { label: "Arrears Year", value: customTableData.demandInvoiceData[customTableData.demandInvoiceData.length - 1].arrears },
      { label: "Penalty (10%)", value: customTableData.demandInvoiceData[customTableData.demandInvoiceData.length - 1].penalty },
      { label: "Grand Total", value: grandTotal, isTotal: true },
    ],
  };

  const pdfRef = useRef<HTMLDivElement>(null);

  const downloadEmailPrintPDF = async (operation: string) => {
    const input = pdfRef.current;
    if (!input) return;

    const scale = 2; // Increase the scale for higher resolution

    try {
      const canvas = await html2canvas(input, {
        scale,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png", 0.75);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [595, 842], // A4 size
      });
      pdf.addImage(imgData, "PNG", 0, 0, 595, 842);

      if (operation === "download") {
        pdf.save(`demand_invoice_${demandInvoiceData.PropertyIdentificationNumber}.pdf`);
      } else if (operation === "email") {
        const pdfBlob = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);

        const subject = encodeURIComponent("Demand Invoice");
        const body = encodeURIComponent(`Please find the attached demand invoice.\n\nDownload the invoice from this link: ${pdfUrl}`);
        const emailURI = `mailto:?subject=${subject}&body=${body}`;

        window.open(emailURI);
      } else if (operation === "print") {
        const otherSections = document.querySelectorAll(".hide-on-print");
        otherSections.forEach(section => section.classList.add("hidden"));
        window.print();
        otherSections.forEach(section => section.classList.remove("hidden"));
      } else {
        console.log("Invalid Operation");
        return;
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
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

  const ChairmanSection: React.FC<{ title: string; subtitle: string }> = ({
    title,
    subtitle,
  }) => {
    return (
      <div className="flex flex-col items-center p-2 pb-6 font-bold border-t font-mulish text-dark-green border-t-dark-green">
        <p className="text-[11px] leading-[13.75px] text-center">{title}</p>
        <p className="text-[8px] text-document-grey pt-1 italic text-center leading-[10px] w-[80%]">
          {subtitle}
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center py-2 space-y-2 bg-white w-[50%] h-[95vh] rounded">
      <div className="flex justify-end w-full px-4">
        <span className="flex items-center justify-center px-0.5 w-[24px] h-[24px] text-xs text-color-dark-red border border-color-dark-red rounded hover:cursor-pointer"
          title="Close Modal"
          onClick={hideDemandInvoiceModal}
        >
          <MdCancel />
        </span>
      </div>
      {/* PDF START*/}
      <div ref={pdfRef} className="bg-white print-section flex flex-col px-4 py-2 space-y-2 w-[100%] max-w-[595px] border border-custom-color-100 rounded overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white">
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
                  <p className="text-left font-bold w-[30%]">
                    {item.label}
                  </p>
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
                className={`flex p-1 text-metal font-lexend text-[11px] leading-[13.75px] ${item.isTotal ? "py-2 bg-custom-blue-100 rounded-b" : ""
                  }`}
              >
                <p className="font-medium text-left w-[130px]">
                  {item.label} :
                </p>
                <p className="flex items-center justify-center font-bold text-primary-color">
                  <span className="mr-1 text-sm text-color-bright-green">
                    <TbCurrencyNaira />
                  </span>
                  {`${formatNumberWithCommas(item.value)}.00`}
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
              NGN{formatNumberWithCommas(demandInvoiceData.billDetailsData[4].value)}
            </span>{" "}
            in respect of the landed property (ies) you are occupying in Abuja
            Municipal Area Council as per details above.
          </p>
          <div className="flex p-1">
            <div className="flex flex-col items-start space-y-1 w-[80%]">
              <p className="font-lexend text-[10px] text-document-grey leading-[12.5px]">
                Payment Options:
              </p>
              <p className="flex items-start justify-center gap-1 font-lexend text-[10px] text-document-grey leading-[12.5px]">
                <span>1.</span>
                <span>AMAC Bank Draft.</span>
              </p>
              <div className="flex items-start justify-center gap-1 font-lexend text-[10px] text-document-grey leading-[12.5px]">
                <span>2.</span>
                <p>
                  Internet Banking Transfer:{" "}
                  <span className="text-color-dark-red">
                    Abuja Municipal Area Council, FCMB Account. No.
                    539240248278.
                  </span>
                </p>
              </div>
              <p className="flex items-start justify-center gap-1 font-lexend text-[10px] text-document-grey leading-[12.5px]">
                <span>3.</span>
                <span>
                  Pay by Scanning QRCode on the right hand (Locate QR Payment
                  on your mobile Banking App, (Choose NIBSS) and Scan QRCode
                  to Pay).
                </span>
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
                {demandInvoiceData.QrCodePayment}
              </p>
            </div>
          </div>
        </div>
        {/* 5TH SECTION */}
        <div className="flex items-center justify-between w-full gap-6">
          <div className="flex flex-col space-y-1 w-[50%]">
            <p className="text-document-grey text-[8px] font-lexend leading-[10px] pb-8">
              Your early compliance will be highly appreciated
            </p>
            <ChairmanSection
              title="HEAD OF TENEMENT RATE"
              subtitle="For Honourable Chairman Abuja Municipal Area Council"
            />
            <ChairmanSection
              title="DIRECTOR OF OPERATIONS"
              subtitle="For Honourable Chairman Abuja Municipal Area Council"
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
      {/* 7TH SECTION */}
      <div className="flex items-center justify-center gap-6 p-2 hide-on-print">
        <span
          className="flex items-center justify-center w-[32px] text-primary-color text-xl bg-white border border-custom-color-one rounded h-[32px] hover:cursor-pointer"
          title="Download"
          onClick={() => { downloadEmailPrintPDF("download") }}
        >
          <LiaDownloadSolid />
        </span>
        <span
          className="flex px-4 py-2.5 gap-1 font-lexend text-xs text-color-text-one items-center justify-center bg-white border border-custom-color-one rounded h-[32px] hover:cursor-pointer"
          title="Share via email"
          onClick={() => { downloadEmailPrintPDF("email") }}
        >
          <span className="text-xl text-primary-color">
            <TfiEmail />
          </span>
          Share via email
        </span>
        <span
          className="flex px-4 py-2.5 gap-1 font-lexend text-xs text-white items-center justify-center bg-primary-color border border-custom-color-one rounded h-[32px] hover:cursor-pointer"
          title="Print"
          onClick={() => { downloadEmailPrintPDF("print") }}
        >
          <span className="text-xl">
            <HiOutlinePrinter />
          </span>
          Print
        </span>
      </div>
      {/* PDF END*/}
    </div>
  );
}

export default DemandInvoiceDocument;