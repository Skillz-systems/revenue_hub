import React from "react";
import { TbCurrencyNaira } from "react-icons/tb";
import { formatNumberWithCommas } from "../../Utils/client";

interface CardProps {
  id: number;
  icon: React.ReactNode;
  description: string;
  name: string;
  value: number;
  containerStyle: string;
  iconStyle: string;
  descriptionStyle: string;
  nameStyle: string;
  currencyStyle?: string;
  valueStyle: string;
}

const Card: React.FC<CardProps> = ({
  id,
  icon,
  description,
  name,
  value,
  containerStyle,
  iconStyle,
  descriptionStyle,
  nameStyle,
  currencyStyle,
  valueStyle,
}) => {
  return (
    <div key={id} className={containerStyle}>
      <div className="flex items-center gap-2 h-[50%]">
        <div className="flex items-center justify-center lg:items-start space-x-1.5 lg:space-x-3">
          <span className={iconStyle}>{icon}</span>
          <div className="flex-col items-start">
            <p className={descriptionStyle}>{description}</p>
            <p className={nameStyle}>{name}</p>
          </div>
        </div>
      </div>
      <div className="flex items-end h-[50%]">
        <div className="flex items-center justify-center gap-1 lg:gap-2">
          {id === 1 && currencyStyle ? (
            <span className={currencyStyle}>
              <TbCurrencyNaira />
            </span>
          ) : null}
          <p className={valueStyle}>{formatNumberWithCommas(value)}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
