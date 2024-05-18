import React, { MouseEvent } from "react";

interface MenuItemAltProps {
  menuId: number;
  menuIcon: JSX.Element;
  menuIconTwo: JSX.Element;
  menuName: string;
  setComponent: () => void;
  isActive: boolean;
}

const MenuItemAlt: React.FC<MenuItemAltProps> = ({
  menuId,
  menuIcon,
  menuIconTwo,
  menuName,
  setComponent,
  isActive,
}) => {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setComponent();
  };

  return (
    <div
      key={menuId}
      className={`flex items-center justify-center transition ease-in-out  hover:cursor-pointer hover:translate-x-1`}
      title={menuName}
      onClick={handleClick}
    >
      <span className={`text-xl text-color-text-two ${isActive ? "text-primary-color" : ""}`}>
        {isActive ? menuIconTwo : menuIcon}
      </span>
    </div>
  );
};

export default MenuItemAlt;
