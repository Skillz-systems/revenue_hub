import React, { useState, ChangeEvent } from "react";

type DummyDataItem = {
  id: number;
  name: string;
};

type SearchInputProps = {
  parentBoxStyle: string;
  inputBoxStyle: string;
  iconBoxStyle: string;
  placeholder: string;
  searchIcon: JSX.Element;
  handleOnInput: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSearch: (name: string) => void;
  displaySearchIcon: boolean;
  dummyData: DummyDataItem[];
};

export default function SearchInput({
  parentBoxStyle,
  inputBoxStyle,
  iconBoxStyle,
  placeholder,
  searchIcon,
  handleOnInput,
  handleSearch,
  displaySearchIcon,
  dummyData,
}: SearchInputProps) {
  const [query, setQuery] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const filteredResults = dummyData.filter((result) =>
    result.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <div className={parentBoxStyle}>
        <input
          type="search"
          value={query}
          className={inputBoxStyle}
          placeholder={placeholder}
          onInput={handleOnInput}
          onChange={handleChange}
        />
        {displaySearchIcon ? (
          <span className={iconBoxStyle}>{searchIcon}</span>
        ) : null}
      </div>
      {query && (
        <div className="flex-col w-full bg-white border rounded border-custom-grey-100">
          {filteredResults.length > 0 ? (
            filteredResults.map((result) => (
              <p
                key={result.id}
                className="text-sm font-lexend py-1.5 px-1.5 hover:bg-custom-grey-100 hover:cursor-pointer border border-y-custom-grey-100"
                onClick={() => {
                  handleSearch(result.name);
                }}
              >
                {result.name}
              </p>
            ))
          ) : (
            <p className="text-sm font-lexend">No results found</p>
          )}
        </div>
      )}
    </>
  );
}
