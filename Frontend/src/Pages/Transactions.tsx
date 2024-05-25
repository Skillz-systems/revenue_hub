import React from "react";
import { TransactionsTable, useAppData, Card, CardData } from "../Components/Index";

const Transactions: React.FC = () => {
  const cardData = CardData();
  const { staticInformation, transactionInformation } = useAppData();

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
      <TransactionsTable
        staticInformation={staticInformation}
        transactionInformation={transactionInformation}
      />
    </div>
  );
};

export default Transactions;
