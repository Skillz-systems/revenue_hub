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
  customTableData,
} from "../Index";

const MenuItemData = () => {
  return [
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
      menuItemCount: customTableData.properties.records.length,
      componentName: "Properties Component",
      component: <Properties />,
    },
    {
      id: 3,
      menuIcon: <PiListBulletsBold />,
      menuIconTwo: <PiListBulletsFill />,
      menuName: "Demand Notice",
      menuItemCount: customTableData.demandNotice.records.length,
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
    },
    {
      id: 5,
      menuIcon: <BsCreditCard2Front />,
      menuIconTwo: <BsCreditCard2FrontFill />,
      menuName: "Transactions",
      menuItemCount: customTableData.transactions.records.length,
      componentName: "Transactions Component",
      component: <Transactions />,
    },
    {
      id: 6,
      menuIcon: <BsPeople />,
      menuIconTwo: <BsPeopleFill />,
      menuName: "Staff",
      menuItemCount: customTableData.staff.records.length,
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
};

export default MenuItemData;
