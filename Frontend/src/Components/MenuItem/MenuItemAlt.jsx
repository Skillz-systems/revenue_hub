export default function MenuItemAlt({
  menuIcon,
  menuIconTwo,
  menuName,
  isActive,
  setComponent,
}) {
  return (
    <div
      className={`flex items-center justify-center transition ease-in-out  hover:cursor-pointer hover:translate-x-1`}
      title={menuName}
      onClick={setComponent}
    >
      <span
        className={`text-xl text-color-text-two ${
          isActive ? "text-primary-color" : ""
        }`}
      >
        {isActive ? menuIconTwo : menuIcon}
      </span>
    </div>
  );
}
