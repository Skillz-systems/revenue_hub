import { TbCurrencyNaira } from "react-icons/tb";
import { formatNumberWithCommas } from "../../Utils/client";

const Card2 = ({ cardData }) => {
  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-8">
      {cardData.map((card) => (
        <div
          key={card.id}
          className={`flex-col items-start p-4 space-y-8 border-0.6 w-full border-custom-color-one shadow rounded
          ${card.id === 1 && "bg-custom-grey-200"}`}
        >
          <div className="flex items-center gap-2">
            <div className="flex items-start space-x-3">
              <span
                className={`flex items-center justify-center w-10 h-10 p-2 text-2xl rounded 
                ${
                  [1].includes(card.id) &&
                  "bg-custom-blue-200 text-primary-color"
                }
                ${
                  [2, 3].includes(card.id) &&
                  "bg-color-light-yellow text-color-bright-orange"
                }  
              `}
              >
                {card.icon}
              </span>
              <div className="flex-col items-start">
                <p className="text-xs text-color-text-two font-lexend">
                  {card.description}
                </p>
                <p className="text-sm font-semibold text-color-text-one font-lexend">
                  {card.name}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-3xl">{formatNumberWithCommas(card.value)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card2;
