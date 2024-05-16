import { TbCurrencyNaira } from "react-icons/tb";
import { formatNumberWithCommas } from "../../Utils/client";

const Card = ({
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
      <div className="flex items-center gap-2">
        <div className="flex items-start space-x-3">
          <span className={iconStyle}>{icon}</span>
          <div className="flex-col items-start">
            <p className={descriptionStyle}>{description}</p>
            <p className={nameStyle}>{name}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {id === 1 && currencyStyle ? (
          <span className={currencyStyle}>
            <TbCurrencyNaira />
          </span>
        ) : null}
        <p className={valueStyle}>{formatNumberWithCommas(value)}</p>
      </div>
    </div>
  );
};

export default Card;
