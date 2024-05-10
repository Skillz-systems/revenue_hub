import { Link, useLocation } from "react-router-dom";

export default function MenuItemAlt({
  menuId,
  menuIcon,
  menuIconTwo,
  menuName,
  setComponent,
  route,
}) {
  const location = useLocation();
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
          location.pathname === route ? "text-primary-color" : ""
        }`}
      >
        {location.pathname === route ? menuIconTwo : menuIcon}
      </span>
    </Link>
  );
}
