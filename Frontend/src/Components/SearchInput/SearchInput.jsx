import { useState } from "react";
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
}) {
  const [query, setQuery] = useState("");

  const handleChange = (event) => {
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
