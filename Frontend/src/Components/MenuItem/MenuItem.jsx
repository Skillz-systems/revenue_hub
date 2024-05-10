import { Link, useLocation } from "react-router-dom";
export default function MenuItem({
  menuId,
  parentDivStyle,
  menuIcon,
  menuIconTwo,
  menuName,
  menuItemCount,
  isActive,
  setComponent,
  route,
}) {
  const location = useLocation();
  return (
    <Link
      key={menuId}
      className={`flex items-center justify-between px-1.5 py-2 transition ease-in-out  hover:cursor-pointer hover:translate-x-1
      ${parentDivStyle}
      ${
        location.pathname === route
          ? "bg-white border-1.5 border-custom-color-two rounded shadow-custom-100"
          : ""
      }
      `}
      title={menuName}
      onClick={setComponent}
      to={route}
    >
      <div className="flex items-center space-x-2">
        <span
          className={`text-2xl text-color-text-two ${
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
        <span className="px-1 text-xs border rounded text-color-text-three font-lexend bg-custom-blue-200 border-custom-color-two">
          {menuItemCount}
        </span>
      ) : null}
    </Link>
  );
}
