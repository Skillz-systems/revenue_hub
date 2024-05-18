import React from "react";

export default function SelectComponent({
  selectContainer,
  selectId,
  selectName,
  selectValue,
  handleSelectChange,
  options,
  selectStyle,
  readOnly,
}) {
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
          <option key={index} value={option.value}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
