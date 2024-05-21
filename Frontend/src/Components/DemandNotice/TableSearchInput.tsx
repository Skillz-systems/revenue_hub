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
}) => {
  return (
    <>
      <div className={parentBoxStyle}>
        <input
          type="search"
          value={query}
          className={inputBoxStyle}
          placeholder={placeholder}
          onInput={handleOnInput}
          onChange={handleQueryChange}
        />
        {displaySearchIcon ? (
          <span className={iconBoxStyle}>{searchIcon}</span>
        ) : null}
      </div>
    </>
  );
}

export default TableSearchInput;
