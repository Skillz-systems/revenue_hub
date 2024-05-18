import React from "react";

export default function InputComponent({
  inputContainer,
  inputId,
  inputType,
  inputName,
  inputValue,
  handleInputChange,
  placeholder,
  required,
  inputStyle,
  iconStyle,
  onIconClick,
  inputIcon,
}) {
  return (
    <div className={inputContainer}>
      <input
        key={inputId}
        type={inputType}
        name={inputName}
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        required={required}
        className={inputStyle}
      />
      <span className={iconStyle} onClick={onIconClick}>{inputIcon}</span>
    </div>
  );
}
