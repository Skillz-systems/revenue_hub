import React, { useState, useEffect } from "react";
import {
  DemandInvoiceTable,
  Card,
  CardData,
  useAppData,
} from "../Components/Index";
import { fetcher, useTokens } from "../Utils/client";
import useSWR from 'swr';

export const DemandNotice: React.FC = () => {
  const { token } = useTokens();
  const cardData = CardData();
  const [demandNoticeInformation, setDemandNoticeInformation] = useState<boolean>(false)
  const { staticInformation } = useAppData();

  const { data, error } = useSWR(
    token ? "https://api.revenuehub.skillzserver.com/api/demand-notice" : null, // Only fetch if token exists
    (url) => fetcher(url, token)
  );

  console.log("Demand Notices:", demandNoticeInformation)

  useEffect(() => {
    if (data) {
      setDemandNoticeInformation(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching Demand Notices Data:", error)
    }
  }, [data])

  return (
    <div className="flex-col space-y-8">
      <div className="grid grid-cols-2 gap-x-3 gap-y-3 md:grid-cols-3 md:gap-x-4 md:gap-y-8">
        {cardData.map((card) => (
          <Card
            id={card.id}
            icon={card.icon}
            description={card.description}
            name={card.name}
            value={card.value}
            containerStyle={`flex flex-col items-start p-2 space-y-4 lg:p-4 lg:space-y-8 border-0.6 w-full border-custom-color-one shadow rounded
                ${card.id === 1 && "bg-custom-grey-200"}`}
            iconStyle={`flex items-center justify-center w-6 lg:w-10 h-6 lg:h-10 lg:p-2 text-base lg:text-2xl rounded 
                ${[1, 2, 3].includes(card.id) &&
              "bg-custom-blue-200 text-primary-color"
              }
                ${card.id === 4 && "bg-color-light-green text-color-dark-green"}
                ${[5, 6].includes(card.id) &&
              "bg-color-light-yellow text-color-bright-orange"
              }
              `}
            descriptionStyle={"text-[10px] lg:text-xs text-color-text-two font-lexend"}
            nameStyle={"text-xs lg:text-sm font-medium lg:font-semibold text-color-text-one font-lexend"}
            currencyStyle={"text-sm lg:text-2xl text-color-bright-green"}
            valueStyle={"text-lg lg:text-3xl"}
          />
        ))}
      </div>
      <hr className="border-0.5 mb-8 border-custom-grey-100" />
      {demandNoticeInformation ? (
        <DemandInvoiceTable
          staticInformation={staticInformation}
          demandNoticeInformation={demandNoticeInformation} />
      ) : (<div>Loading...</div>)}
    </div>
  );
}

export default DemandNotice;
