import React from "react";
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
import {
  DemandNotice,
  Transactions,
  Overview,
  Staff,
  Settings,
  Properties,
  Statistics,
  useAppData,
  userData,
} from "../Index";

interface CardInformation {
  totalRegisteredProperties: number;
  totalGeneratedDemandNotices: number;
  transactionInformationValue: number;
}

interface MenuItem {
  id: number;
  menuIcon: JSX.Element;
  menuIconTwo: JSX.Element;
  menuName: string;
  menuItemCount: number;
  componentName: string;
  component: JSX.Element;
}

const MenuItemData = () => {
  const { cardInformation } = useAppData();
  const { totalStaff } = userData();

  const menuItems: MenuItem[] = [
    {
      id: 1,
      menuIcon: <RiHome6Line />,
      menuIconTwo: <RiHome6Fill />,
      menuName: "Overview",
      menuItemCount: 0,
      componentName: "Overview Component",
      component: <Overview />,
    },
    {
      id: 2,
      menuIcon: <PiBuildings />,
      menuIconTwo: <PiBuildingsFill />,
      menuName: "Properties",
      menuItemCount: cardInformation.totalRegisteredProperties,
      componentName: "Properties Component",
      component: <Properties />,
    },
    {
      id: 3,
      menuIcon: <PiListBulletsBold />,
      menuIconTwo: <PiListBulletsFill />,
      menuName: "Demand Notice",
      menuItemCount: cardInformation.totalGeneratedDemandNotices,
      componentName: "Demand Notice Component",
      component: <DemandNotice />,
    },
    {
      id: 4,
      menuIcon: <HiOutlineChartPie />,
      menuIconTwo: <HiChartPie />,
      menuName: "Statistics",
      menuItemCount: 0,
      componentName: "Statistic Component",
      component: <Statistics />,
    },
    {
      id: 5,
      menuIcon: <BsCreditCard2Front />,
      menuIconTwo: <BsCreditCard2FrontFill />,
      menuName: "Transactions",
      menuItemCount: cardInformation.transactionInformationValue,
      componentName: "Transactions Component",
      component: <Transactions />,
    },
    {
      id: 6,
      menuIcon: <BsPeople />,
      menuIconTwo: <BsPeopleFill />,
      menuName: "Staff",
      menuItemCount: totalStaff,
      componentName: "Staff Component",
      component: <Staff />,
    },
    {
      id: 7,
      menuIcon: <IoSettingsOutline />,
      menuIconTwo: <IoSettings />,
      menuName: "Settings",
      menuItemCount: 0,
      componentName: "Settings Component",
      component: <Settings />,
    },
  ];

  return menuItems;
};

export default MenuItemData;
