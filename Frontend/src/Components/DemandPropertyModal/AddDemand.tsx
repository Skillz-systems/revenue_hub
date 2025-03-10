import React, { useEffect, useState } from "react";
import { data } from "./inputFieldData";
import { useTokens, useTriggerError } from "../../Utils/client";
import axios from "axios";
import { BsCaretDownFill } from "react-icons/bs";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import images from "../../assets/index";
import QRCode from "react-qr-code";
import { formatNumberWithCommas } from "../../Utils/client";
import { renderToStaticMarkup } from "react-dom/server";
import { LoadingSpinner } from "../Index";
import { LiaDownloadSolid } from "react-icons/lia";
const apiUrl = import.meta.env.VITE_API_URL as string;
interface AddPropertyProps {
  hideAddDemandModal: () => void;
  propertyModalTransition: boolean;
}
interface SectionProps {
  title: string;
  data: { label: string; width?: string }[];
}

const AddProperty: React.FC<AddPropertyProps> = ({
  hideAddDemandModal,
  propertyModalTransition,
}) => {

  const { token } = useTokens();
  const [loadingCadastralZone, setLoadingCadastralZone] = useState(false);
  const [loadingStreet, setLoadingStreet] = useState(false);
  const [ratingDistricts, setRatingDistricts] = useState([]);
  const [ratingDistrict, setRatingDistrict] = useState(0);
  const [cadastralZone, setCadastralZone] = useState(0);
  const [street, setStreet] = useState(0);
  const [cadastralZones, setCadastralZones] = useState([]);
  const [batch, setBatch] = useState([]);
  const [streets, setStreets] = useState([]);
  const [loadingBatch, setLoadingBatch] = useState<boolean>(false);
  const [downloadLoader, setDownloadLoader] = useState<boolean>(false);
  const [generateDemandNoticeLoader, setGenerateDemandNoticeLoader] = useState<boolean>(false);
  const [downloadLoaderId, setDownloadLoaderId] = useState<number>(0);


  useEffect(() => {
    // When ratingDistrict changes, reset both cadastralZone and street
    if (ratingDistrict > 0) {
      setCadastralZone(0); // Reset cadastral zone
      setStreet(0); // Reset street
      setCadastralZones([]); // Reset cadastral zone
      setStreets([]); // Reset street
      fetchCadastralZone();
    }
  }, [ratingDistrict]);

  useEffect(() => {
    // When cadastralZone changes, reset the street
    if (cadastralZone > 0) {
      setStreet(0); // Reset street
      setStreets([]); // Reset street
      fetchStreet();
    }
  }, [cadastralZone]);


  const fetchCadastralZone = async () => {
    setLoadingCadastralZone(true)
    try {
      const response = await axios.get(
        `${apiUrl}/api/cadastral-zone/by-rating-district/${ratingDistrict}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response) {
        setCadastralZones(response.data.data);
        setLoadingCadastralZone(false)
      }

    } catch (error) {
      console.error(error);
      setLoadingCadastralZone(false)
    }
  };

  const fetchStreet = async () => {
    setLoadingStreet(true)
    try {
      const response = await axios.get(
        `${apiUrl}/api/street/by-cadastral-zone/${cadastralZone}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response) {
        setStreets(response.data.data);
        setLoadingStreet(false)
      }

    } catch (error) {
      console.error(error);
      setLoadingStreet(false)
    }
  };
  const downloadDemandNotice = async (id: number) => {
    setDownloadLoader(true)
    try {
      const response = await axios.get(
        `${apiUrl}/api/demand-notice/print-batch-demand-notice/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response) {
        // generate download from demand notice list
        console.log(response.data)
        downloadEmailPrintPDF(response.data.data)
        setDownloadLoader(false)
      }

    } catch (error) {
      console.error(error);
      setDownloadLoader(false)
    }
  };

  useEffect(() => {
    fetchRatingDistrict();
    fetchCurrentYearBatch();
  }, [token]);

  const fetchRatingDistrict = async () => {
    setCadastralZones([])
    setCadastralZone(0)
    setStreets([])
    setStreet(0)

    try {
      const response = await axios.get(`${apiUrl}/api/rating-district`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRatingDistricts(response.data.data)

    } catch (error) {
      console.error(error);
    }
  };

  const generateBulkDemandNotice = async () => {
    setGenerateDemandNoticeLoader(true)
    const data = {
      rating_district_id: ratingDistrict,
      cadastral_zone_id: cadastralZone,
      street_id: street
    }
    try {
      const response = await axios.post(`${apiUrl}/api/demand-notice/create-bulk-demand-notice`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      if (response) {
        setGenerateDemandNoticeLoader(false)
        fetchCurrentYearBatch()
      }


    } catch (error) {
      console.error(error);
      setGenerateDemandNoticeLoader(false)
    }
  }

  const fetchCurrentYearBatch = async () => {
    setLoadingBatch(true)
    try {
      const response = await axios.get(
        `${apiUrl}/api/demand-notice/get-batch-demand-notice`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response) {
        setBatch(response.data.data);
        setLoadingBatch(false)
      }

    } catch (error) {
      console.error(error);
      setLoadingBatch(false)
    }
  };

  // const downloadEmailPrintPDF = async (BatchedDemandNotice: any) => {
  //   try {
  //     const options = {
  //       scale: 2, // Increase the scale for better quality
  //       useCORS: true, // Allow cross-origin images
  //     };

  //     const pdf = new jsPDF({
  //       orientation: "portrait",
  //       unit: "px",
  //       format: [595, 840], // A4 size
  //       compress: true,
  //     });

  //     for (const [index, demandNotice] of BatchedDemandNotice.entries()) {
  //       // Create the first section
  //       const tempDiv1 = document.createElement("div");
  //       tempDiv1.innerHTML = firstSectionTemplate(demandNotice);
  //       tempDiv1.classList.add(
  //         "w-[50%]",
  //         "overflow-auto",
  //         "overscroll-contain",
  //         "scrollbar-thin",
  //         "scrollbar-thumb-color-text-two",
  //         "scrollbar-track-white"
  //       );
  //       tempDiv1.style.position = "absolute";
  //       tempDiv1.style.left = "-9999px";
  //       document.body.appendChild(tempDiv1);
  //       const firstCanvas = await html2canvas(tempDiv1, options);

  //       // Create the second section
  //       const tempDiv2 = document.createElement("div");
  //       tempDiv2.innerHTML = secondSectionTemplate();
  //       tempDiv2.style.position = "absolute";
  //       tempDiv2.style.left = "-9999px";
  //       tempDiv2.classList.add(
  //         "w-[50%]",
  //         "overflow-auto",
  //         "overscroll-contain",
  //         "scrollbar-thin",
  //         "scrollbar-thumb-color-text-two",
  //         "scrollbar-track-white"
  //       );
  //       document.body.appendChild(tempDiv2);

  //       const secondCanvas = await html2canvas(tempDiv2, options);

  //       if (index > 0) {
  //         pdf.addPage();
  //       }

  //       // Add the first section to the PDF
  //       const imgDataFirst = firstCanvas.toDataURL("image/webp", 1.0);
  //       if (imgDataFirst) {
  //         pdf.addImage(imgDataFirst, "WEBP", 0, 0, 595, 835);
  //       } else {
  //         console.error("Failed to create first canvas image");
  //       }

  //       // Add the second section to the PDF
  //       pdf.addPage();
  //       const imgDataSecond = secondCanvas.toDataURL("image/webp", 1.0);
  //       if (imgDataSecond) {
  //         pdf.addImage(imgDataSecond, "WEBP", 0, 0, 595, 400);
  //       } else {
  //         console.error("Failed to create second canvas image");
  //       }

  //       // Cleanup
  //       document.body.removeChild(tempDiv1);
  //       document.body.removeChild(tempDiv2);
  //     }

  //     pdf.save(`demand_invoice.pdf`);
  //     console.log("PDF generated", pdf);
  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //   }
  // };

  const downloadEmailPrintPDF = async (BatchedDemandNotice: any) => {
    try {
      const options = {
        scale: 2,
        useCORS: true,
      };

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [595, 840],
        compress: true,
      });

      const chunkSize = 50; // Process in chunks
      let pageIndex = 0;

      const processChunk = async (chunk: any) => {
        for (const demandNotice of chunk) {
          // Create the first section
          const tempDiv1 = document.createElement("div");
          tempDiv1.innerHTML = firstSectionTemplate(demandNotice);
          tempDiv1.classList.add(
            "w-[50%]",
            "overflow-auto",
            "overscroll-contain",
            "scrollbar-thin",
            "scrollbar-thumb-color-text-two",
            "scrollbar-track-white"
          );
          tempDiv1.style.position = "absolute";
          tempDiv1.style.left = "-9999px";
          document.body.appendChild(tempDiv1);
          const firstCanvas = await html2canvas(tempDiv1, options);

          // Create the second section
          const tempDiv2 = document.createElement("div");
          tempDiv2.innerHTML = secondSectionTemplate();
          tempDiv2.classList.add(
            "w-[50%]",
            "overflow-auto",
            "overscroll-contain",
            "scrollbar-thin",
            "scrollbar-thumb-color-text-two",
            "scrollbar-track-white"
          );
          tempDiv2.style.position = "absolute";
          tempDiv2.style.left = "-9999px";
          document.body.appendChild(tempDiv2);
          const secondCanvas = await html2canvas(tempDiv2, options);

          if (pageIndex > 0) {
            pdf.addPage();
          }

          // Add the first section to the PDF
          const imgDataFirst = firstCanvas.toDataURL("image/jpeg", 0.7);
          pdf.addImage(imgDataFirst, "JPEG", 0, 0, 595, 835);

          // Add the second section to the PDF
          pdf.addPage();
          const imgDataSecond = secondCanvas.toDataURL("image/jpeg", 0.7);
          pdf.addImage(imgDataSecond, "JPEG", 0, 0, 595, 400);

          // Cleanup
          document.body.removeChild(tempDiv1);
          document.body.removeChild(tempDiv2);
          pageIndex++;

          // Free canvas memory
          firstCanvas.width = 0;
          firstCanvas.height = 0;
          secondCanvas.width = 0;
          secondCanvas.height = 0;
        }
      };

      // Batch processing with a delay to avoid freezing
      for (let i = 0; i < BatchedDemandNotice.length; i += chunkSize) {
        const chunk = BatchedDemandNotice.slice(i, i + chunkSize);
        await processChunk(chunk);
        await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay
      }

      pdf.save(`demand_invoice.pdf`);
      console.log("PDF generated", pdf);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };


  const firstSectionTemplate = (demandInvoiceInfo: any) => {
    const demandInvoiceData = {
      Occupant: `THE OCCUPIER/${demandInvoiceInfo?.property.pid
        }`,
      PropertyIdentificationNumber: `PID-${demandInvoiceInfo?.property.pid
        }`,
      QrCodePayment: `{https://revenuehub.ng/invoice/${demandInvoiceInfo?.property.pid
        }`,
      propertyData: [
        {
          label: "Name of Occupier",
          value: `${demandInvoiceInfo?.property?.occupant
            }`,
        },
        { label: "Assessment No", value: "AM/B12/TTR/2016/0400" },
        {
          label: "Property Address",
          value:

            demandInvoiceInfo?.property.prop_addr,
        },
        {
          label: "Cadestral Zone",
          value:

            demandInvoiceInfo?.property.cadastral_zone,
        },
        {
          label: "Use of Property",
          value:
            demandInvoiceInfo?.property.prop_use,
        },
        {
          label: "Rating District",
          value:
            demandInvoiceInfo?.property.rating_dist,
        },
      ],
      billInfoData: [
        {
          label: "Bill Ref",
          value: `2025/${demandInvoiceInfo?.id}`,
        },
        { label: "Agency Code", value: 2000300 },
        { label: "Revenue Code", value: 1002 },
        { label: "Rate Year", value: 2025 },
      ],
      billDetailsData: [
        {
          label: "Annual Value",
          value:
            demandInvoiceInfo?.property.annual_value,
        },
        {
          label: "Rate Payable",
          value:
            demandInvoiceInfo?.property.rate_payable,
        },
        {
          label: "Arrears Year",
          value:
            demandInvoiceInfo?.arrears_amount,
        },
        {
          label: "Penalty (10%)",
          value:
            demandInvoiceInfo?.penalty,
        },

        {
          label: "Grand Total",
          value:
            demandInvoiceInfo?.amount,
          isTotal: true,
        },
      ],
    };
    return renderToStaticMarkup(<div
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
        <div className="flex items-center justify-between p-1 rounded-t bg-document-bg-grey printPaddingBottom pb-4">
          <p className="text-document-grey font-lexend text-[11px] font-bold leading-[13px] w-[50%]">
            Demand Notice is hereby given to
          </p>
          <p className="text-document-grey text-right font-lexend text-[11px] leading-[13px] w-[50%]">
            {demandInvoiceData.Occupant}
          </p>
        </div>
        <div className="flex items-center justify-center gap-1 p-1 printPaddingBottom pb-4">
          <div className="flex flex-col items-start space-y-1 font-lexend w-[70%]">
            <p className="text-document-grey text-right font-lexend text-[11px] leading-[13px]">
              In respect of the property below:
            </p>
            {demandInvoiceData.propertyData.map((item: any, index: any) => (
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
      {/* 3RD SECTION */}
      <div className="flex items-center justify-between w-full gap-2">
        <div className="flex flex-col gap-y-2 w-[50%] align-center justify-center">
          <p className="text-color-text-two text-left font-lexend text-[11px] leading-[13px] printPaddingBottom pb-4">
            BILL INFORMATION
          </p>
          <div className="flex flex-col gap-0 border rounded border-custom-color-100 printPaddingBottom pb-4">
            {demandInvoiceData.billInfoData.map((item: any, index: any) => (
              <div
                key={index}
                className="flex p-1 text-metal font-lexend text-[11px] leading-[13px]"
              >
                <p className="font-medium text-left w-[50%]">
                  {item.label} :
                </p>
                <p className="font-bold text-primary-color">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-0 border rounded border-custom-color-100 w-[50%]">
          {demandInvoiceData.billDetailsData.map((item: any, index: any) => (
            <div
              key={index}
              className={`flex items-center px-1 py-0.5 text-metal font-lexend text-[11px] leading-[13px] ${item.isTotal ? "py-1 bg-custom-blue-100 rounded-b" : ""
                }`}
            >
              <p className="font-medium text-left w-[130px] printPaddingBottom2 pb-2">
                {item.label} :
              </p>
              <p className="flex items-center justify-center font-bold text-primary-color printPaddingBottom2 pb-2">
                <span className="mr-1 text-xs text-color-bright-green">
                  ₦
                </span>
                <span>{`${formatNumberWithCommas(item.value)}`}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* 4TH SECTION */}
      <div className="flex flex-col w-full space-y-1 border rounded border-custom-color-one">
        <p className="text-[11px] p-1 font-lexend font-light leading-[12.5px] text-document-grey border-b border-custom-color-one pb-2 printPaddingBottom pb-4">
          In accordance with the provision of section 7 (4th Schedule) of
          the 1999 constitution of the Federal Republic Of Nigeria; Federal
          Capital Territory Act Cap 503, LPN 2004 (vol. 3) as amended: Taxes
          and Levies (Approved list of Collection ) Act 2015 (as amended and
          AMAC Tenement Rate bye-Laws of 2014. We forward herewith your bill
          for the year 2025, totaling{" "}
          <span className="font-normal text-color-dark-red">
            NGN
            {formatNumberWithCommas(
              demandInvoiceData.billDetailsData[4].value
            )}
          </span>{" "}
          in respect of the landed property (ies) you are occupying in Abuja
          Municipal Area Council as per details above.
        </p>
        <div className="flex p-1 printPaddingBottom pb-4">
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
                Inform the teller that you want to make a NIBSS e-bills payment for AMAC Zone A & C tenement
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
        </div>
      </div>
      {/* 5TH SECTION */}
      <div className="flex items-start w-full">
        <p className="text-left text-document-grey text-[9px] font-lexend">
          Your early compliance will be highly appreciated
        </p>
      </div>
      <div className="flex items-center justify-between w-full gap-6">
        <div className="flex flex-col w-[50%] items-start justify-between officialStyleParent space-y-3 pb-6">
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
      <p className="font-medium text-[9px] leading-[11px] text-faint-grey text-center font-red-hat">
        <span className="font-bold text-color-dark-red">NOTE:</span> Ensure
        you collect Electronic and Treasury reciepts(s) at Annex Office:
        Suite 301, 3rd floor, Kano House, Ralph Shodeinde Street, Central
        Business District, Abuja, FCT.
      </p>
    </div>)


  }
  const secondSectionTemplate = () => {
    return renderToStaticMarkup(
      <div
        className="bg-white print-section flex flex-col px-4 py-2 space-y-4 w-[100%]"
      >
        {/* 7TH SECTION */}
        <div className="flex flex-col w-full p-1 border rounded font-lexend border-custom-color-one printPaddingBottom pb-4">
          <h3 className="text-center text-[12px] text-metal font-semibold">
            Annex Offices:
          </h3>
          <div className="flex flex-col flex-wrap w-full h-auto">
            <p className="flex items-start just gap-1 text-[11px] text-metal leading-[18px]">
              <span>1.</span>
              <span>
                Suite 301, 3rd floor, Kano House, Ralph Shodeinde Street,
                Central Business District, Abuja, FCT.
              </span>
            </p>
            <p className="flex items-start just gap-1 text-[11px] text-metal leading-[18px]">
              <span>2.</span>
              <span>
                Suite 112, 1st Floor, MKK Plaza Gudu, Gudu District, Abuja,
                FCT.
              </span>
            </p>
            <p className="flex items-start just gap-1 text-[11px] text-metal leading-[18px]">
              <span>3.</span>
              <span>
                Suite 24, First floor, Nyanya Plaza, along Karu Jikwoyi Road,
                Nyanya, Abuja, FCT.
              </span>
            </p>
          </div>
        </div>
        {/* 8TH SECTION */}
        <div className="flex flex-col w-full p-1 border rounded font-lexend border-custom-color-one printPaddingBottom pb-4">
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
        {/* 9TH SECTION */}
        <div className="flex flex-col w-full p-1 font-lexend text-[11px] text-metal leading-[18px] printPaddingBottom pb-4">
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
        {/* 10TH SECTION */}
        <div className="flex flex-col w-full p-1 border rounded font-lexend border-custom-color-one printPaddingBottom pb-4">
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
        {/* 11TH SECTION */}
        <div className="flex flex-col w-full p-1 border rounded font-lexend border-custom-color-one printPaddingBottom pb-4">
          <b className="text-[11px] text-metal leading-[18px]">
            Note: A change of the use of property from residential to
            commericial without notifying the council in writing shall attract
            a penalty of ₦5,000,000.000
          </b>
        </div>
      </div>
    )
  }

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
      <div className="flex flex-col py-1  officialStyleParent border-b border-custom-color-one printPaddingBottom space-y-3 pb-6">
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
      <div className="flex flex-col items-center w-full printPaddingBottom2 pb-2">
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
    <div
      className={`flex-col relative min-w-[290px] sm:min-w-[350px] md:min-w-[500px] bg-white rounded overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white ${propertyModalTransition
        ? "lg:w-4/12 transition-all ease-in-out duration-500"
        : "w-32"
        }`}
      style={{ height: "95vh" }}
    >
      <img
        src={"/lightCheckeredBackgroundPattern.png"}
        alt="Checkered Background"
        className="absolute top-0 left-0 z-0 w-1/2"
      />
      <div className="absolute z-10 flex-col w-full p-4 space-y-16">
        <div
          className="flex items-start justify-between"
          style={{ height: "10vh" }}
        >
          <h3 className="text-base font-bold text-color-text-two">
            BATCH DEMAND NOTICE
          </h3>
          <button
            className="w-1/5 text-xs text-color-dark-red font-lexend font-medium px-0.5 py-2 border-0.6 border-color-dark-red rounded"
            onClick={hideAddDemandModal}
            type="button"
            title="Close Add New Property Modal"
          >
            Close
          </button>
        </div>

        <Tabs>
          <TabList >
            <Tab>New Batch</Tab>
            <Tab>All Batch</Tab>
          </TabList>

          <TabPanel>
            <div className="flex-col space-y-6">
              <div>
                <h3 className="text-sm font-bold text-color-text-two">
                  Rating District
                </h3><div
                  className="w-[100%] flex items-center justify-between gap-2 pr-1.5 border rounded border-divider-grey text-color-text-two"
                  title="Filter by District"
                >
                  <select
                    className="w-[100%] hover:cursor-pointer p-2 py-1.5 overflow-y-auto text-xs font-medium rounded outline-none appearance-none font-lexend overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white"
                    onChange={(e: any) => setRatingDistrict(e.target.value)}
                    value={ratingDistrict}
                  >
                    <option value="0"> All Districts</option>
                    {ratingDistricts.map((district: any, index) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                  <span className="text-xs">
                    <BsCaretDownFill />
                  </span>
                </div>

              </div>
              {ratingDistrict > 0 && !loadingCadastralZone ? (
                <div>
                  <h3 className="text-sm font-bold text-color-text-two">
                    Cadastral Zone
                  </h3>

                  <div
                    className="w-[100%] flex items-center justify-between gap-2 pr-1.5 border rounded border-divider-grey text-color-text-two"
                    title="Filter by District"
                  >
                    <select
                      className="w-[100%] hover:cursor-pointer p-2 py-1.5 overflow-y-auto text-xs font-medium rounded outline-none appearance-none font-lexend overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white"
                      onChange={(e: any) => setCadastralZone(e.target.value)}
                      value={cadastralZone}
                    >
                      <option value="0"> Cadastral Zone</option>
                      {cadastralZones.map((cadastralZone: any, index) => (
                        <option key={cadastralZone.id} value={cadastralZone.id}>
                          {cadastralZone.name}
                        </option>
                      ))}
                    </select>
                    <span className="text-xs">
                      <BsCaretDownFill />
                    </span>
                  </div>
                </div>
              ) : loadingCadastralZone ? <LoadingSpinner title="" /> : null
              }

              {cadastralZone > 0 && !loadingStreet ?
                <div>
                  <h3 className="text-sm font-bold text-color-text-two">
                    Street
                  </h3>

                  <div
                    className="w-[100%] flex items-center justify-between gap-2 pr-1.5 border rounded border-divider-grey text-color-text-two"
                    title="Filter by District"
                  >
                    <select
                      className="w-[100%] hover:cursor-pointer p-2 py-1.5 overflow-y-auto text-xs font-medium rounded outline-none appearance-none font-lexend overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white"
                      onChange={(e: any) => setStreet(e.target.value)}
                      value={street}
                    >
                      <option value="0"> Select Street</option>
                      {streets.map((street: any, index) => (
                        <option key={street.id} value={street.id}>
                          {street.name}
                        </option>
                      ))}
                    </select>
                    <span className="text-xs">
                      <BsCaretDownFill />
                    </span>
                  </div>
                </div> : loadingStreet ? <LoadingSpinner title="" /> : null
              }

              {street > 0 ?
                <div className="flex items-center">
                  {generateDemandNoticeLoader ? <LoadingSpinner title="" /> :

                    <button
                      className="w-full text-sm text-white font-lexend font-medium px-6 py-3 border-0.6 bg-primary-color rounded"
                      onClick={() => generateBulkDemandNotice()}
                      type="button"
                      title="Close Add New Property Modal"
                    >
                      Generate Demand Notice
                    </button>
                  }
                </div> : null}
            </div>
          </TabPanel>
          <TabPanel>
            {batch.length > 0 && (
              batch.map((batch: any, index: number) => (
                <div key={batch.id} className="flex border rounded p-2 mb-2">
                  <div className="w-[90%]">{batch.street.name}</div>
                  <div >
                    <span
                      className="flex items-center px-1 justify-center gap-1 font-lexend max-w-max text-primary-color text-xl bg-white border border-custom-color-one rounded h-[32px] hover:cursor-pointer"
                      title="Download"
                      onClick={() => {
                        setDownloadLoaderId(batch.id)
                        downloadDemandNotice(batch.id)
                      }}
                    >

                      {downloadLoader && downloadLoaderId == batch.id ? (
                        <LoadingSpinner title="" />
                      ) : <LiaDownloadSolid />}
                    </span>
                  </div>
                </div>
              ))

            )}

          </TabPanel>
        </Tabs>

      </div>
    </div>
  );
};

export default AddProperty;
