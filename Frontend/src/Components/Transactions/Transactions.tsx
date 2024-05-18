import React from "react";
import { TransactionsTable, useAppData, Card, CardData } from "../Index";

const Transactions: React.FC = () => {
  const cardData = CardData();
  const { staticInformation, transactionInformation } = useAppData();

  return (
    <div className="flex-col space-y-8">
      <div className="grid grid-cols-3 gap-x-4 gap-y-8">
        {cardData.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            icon={card.icon}
            description={card.description}
            name={card.name}
            value={card.value}
            containerStyle={`flex-col items-start p-4 space-y-8 border-0.6 w-full border-custom-color-one shadow rounded
                ${card.id === 1 && "bg-custom-grey-200"}`}
            iconStyle={`flex items-center justify-center w-10 h-10 p-2 text-2xl rounded 
                ${[1, 2, 3].includes(card.id) &&
              "bg-custom-blue-200 text-primary-color"
              }
                ${card.id === 4 && "bg-color-light-green text-color-dark-green"}
                ${[5, 6].includes(card.id) &&
              "bg-color-light-yellow text-color-bright-orange"
              }
              `}
            descriptionStyle={"text-xs text-color-text-two font-lexend"}
            nameStyle={"text-sm font-semibold text-color-text-one font-lexend"}
            currencyStyle={"text-2xl text-color-bright-green"}
            valueStyle={"text-3xl"}
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
