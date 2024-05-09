import { Link } from "react-router-dom";

export default function MenuItemAlt({
  menuId,
  menuIcon,
  menuIconTwo,
  menuName,
  isActive,
  setComponent,
  route,
}) {
  return (
    <Link
      key={menuId}
      className={`flex items-center justify-center transition ease-in-out  hover:cursor-pointer hover:translate-x-1`}
      title={menuName}
      onClick={setComponent}
      to={route}
    >
      <span
        className={`text-xl text-color-text-two ${
          isActive ? "text-primary-color" : ""
        }`}
      >
        {isActive ? menuIconTwo : menuIcon}
      </span>
    </Link>
  );
}
