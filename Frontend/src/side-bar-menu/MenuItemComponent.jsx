export default function MenuItemComponent({
  menuIcon,
  menuIconTwo,
  menuName,
  menuItemCount,
  isActive,
  setComponent,
}) {
  return (
    <div
      className={`flex w-11/12 items-center justify-between space-x-2 px-1.5 py-2.5 hover:cursor-pointer 
      ${
        isActive
          ? "bg-white border-1.5 border-custom-color-two rounded shadow-custom-100"
          : ""
      }`}
      title={menuName}
      onClick={setComponent}
    >
      <div className="flex items-center space-x-2">
        <span
          className={`text-xl text-color-text-two ${
            isActive ? "text-primary-color" : ""
          }`}
        >
          {isActive ? menuIconTwo : menuIcon}
        </span>
        <span
          className={`text-xs text-left text-color-text-two font-lexend ${
            isActive ? "text-primary-color font-semibold" : ""
          }`}
        >
          {menuName}
        </span>
      </div>
      {menuItemCount ? (
        <span className="text-xs text-color-text-three font-lexend px-1 bg-custom-blue-200 border border-custom-color-two rounded">
          {menuItemCount}
        </span>
      ) : null}
    </div>
  );
}
