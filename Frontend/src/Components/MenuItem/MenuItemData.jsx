import { RiHome6Line, RiHome6Fill } from "react-icons/ri";
import {
  PiBuildings,
  PiBuildingsFill,
  PiListBulletsBold,
  PiListBulletsFill,
} from "react-icons/pi";
import { HiOutlineChartPie, HiChartPie } from "react-icons/hi";
import {
  BsCreditCard2Front,
  BsCreditCard2FrontFill,
  BsPeople,
  BsPeopleFill,
} from "react-icons/bs";
import { IoSettingsOutline, IoSettings } from "react-icons/io5";

const MenuItemData = () => {
  return [
    {
      menuIcon: <RiHome6Line />,
      menuIconTwo: <RiHome6Fill />,
      menuName: "Overview",
      menuItemCount: 0,
      componentName: "Overview Component",
    },
    {
      menuIcon: <PiBuildings />,
      menuIconTwo: <PiBuildingsFill />,
      menuName: "Properties",
      menuItemCount: 570,
      componentName: "Properties Component",
    },
    {
      menuIcon: <PiListBulletsBold />,
      menuIconTwo: <PiListBulletsFill />,
      menuName: "Demand Notice",
      menuItemCount: 420,
      componentName: "Demand Notice Component",
    },
    {
      menuIcon: <HiOutlineChartPie />,
      menuIconTwo: <HiChartPie />,
      menuName: "Statistics",
      menuItemCount: 0,
      componentName: "Statistic Component",
    },
    {
      menuIcon: <BsCreditCard2Front />,
      menuIconTwo: <BsCreditCard2FrontFill />,
      menuName: "Transactions",
      menuItemCount: 120,
      componentName: "Transactions Component",
    },
    {
      menuIcon: <BsPeople />,
      menuIconTwo: <BsPeopleFill />,
      menuName: "Staff",
      menuItemCount: 12,
      componentName: "Staff Component",
    },
    {
      menuIcon: <IoSettingsOutline />,
      menuIconTwo: <IoSettings />,
      menuName: "Settings",
      menuItemCount: 0,
      componentName: "Settings Component",
    },
  ];
};

export default MenuItemData;
