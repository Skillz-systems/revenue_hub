import React from "react";

interface TableSearchInputProps {
  parentBoxStyle: string;
  inputBoxStyle: string;
  iconBoxStyle: string;
  placeholder: string;
  searchIcon: React.ReactNode;
  handleOnInput: (event: React.FormEvent<HTMLInputElement>) => void;
  displaySearchIcon: boolean;
  query: string;
  handleQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSnackBar: any;
}

const TableSearchInput: React.FC<TableSearchInputProps> = ({
  parentBoxStyle,
  inputBoxStyle,
  iconBoxStyle,
  placeholder,
  searchIcon,
  handleOnInput,
  displaySearchIcon,
  query,
  handleQueryChange,
  setSnackBar,
}) => {
  return (
    <div className={parentBoxStyle}>
      <input
        type="text"
        className={inputBoxStyle}
        placeholder={placeholder}
        value={query}
        onChange={handleQueryChange}
        onInput={handleOnInput}
      />
      {displaySearchIcon && (
        <div className={iconBoxStyle}>
          {searchIcon}
        </div>
      )}
    </div>
  );
};

export default TableSearchInput;
