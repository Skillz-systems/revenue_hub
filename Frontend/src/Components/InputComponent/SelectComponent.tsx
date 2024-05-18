import React, { ChangeEvent } from "react";

interface SelectComponentProps {
  selectContainer: string;
  selectId: string;
  selectName: string;
  selectValue: string;
  handleSelectChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  selectStyle: string;
  readOnly?: boolean;
}

const SelectComponent: React.FC<SelectComponentProps> = ({
  selectContainer,
  selectId,
  selectName,
  selectValue,
  handleSelectChange,
  options,
  selectStyle,
  readOnly,
}) => {
  return (
    <div className={selectContainer}>
      <select
        key={selectId}
        name={selectName}
        value={selectValue}
        onChange={handleSelectChange}
        className={`${selectStyle} overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white`}
        disabled={readOnly}
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectComponent;
