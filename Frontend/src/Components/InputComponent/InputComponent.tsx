import React, { ChangeEvent, MouseEvent } from "react";

interface InputComponentProps {
  inputContainer: string;
  inputId?: number;
  inputType: string;
  inputName?: string;
  inputValue: string;
  handleInputChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  inputStyle: string;
  readOnly?: boolean;
  iconStyle?: string;
  onIconClick?: (event: MouseEvent<HTMLSpanElement>) => void;
  inputIcon?: React.ReactNode;
}

const InputComponent: React.FC<InputComponentProps> = ({
  inputContainer,
  inputId,
  inputType,
  inputName,
  inputValue,
  handleInputChange,
  placeholder,
  required,
  inputStyle,
  readOnly,
  iconStyle,
  onIconClick,
  inputIcon,
}) => {
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
        readOnly={readOnly}
      />
      {inputIcon && (
        <span className={iconStyle} onClick={onIconClick}>
          {inputIcon}
        </span>
      )}
    </div>
  );
};

export default InputComponent;
