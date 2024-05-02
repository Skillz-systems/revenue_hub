export default function SearchComponent({ placeholder, searchIcon, onSubmit }) {
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-custom-grey-100 rounded-3xl border border-custom-color-one">
      <input
        type="search"
        className="text-xs bg-inherit font-lexend text-color-text-two outline-none w-10/12"
        placeholder={placeholder}
        onKeyPress={handleKeyPress}
      />
      <span className="text-base text-primary-color hover:cursor-pointer" onClick={onSubmit}>
        {searchIcon}
      </span>
    </div>
  );
}
