export default function TableSearchInput({
  parentBoxStyle,
  inputBoxStyle,
  iconBoxStyle,
  placeholder,
  searchIcon,
  handleOnInput,
  displaySearchIcon,
  query,
  handleQueryChange,
}) {
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
