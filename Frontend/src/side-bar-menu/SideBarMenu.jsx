import { useState } from "react";
import ProfileComponent from "./ProfileComponent";
import SearchComponent from "./SearchComponent";
import DemandPropertyComponent from "./DemandPropertyComponent";
import MenuItemComponent from "./MenuItemComponent";
import { FaChevronLeft } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { PiListBulletsFill, PiListBulletsBold } from "react-icons/pi";
import { PiBuildingsFill, PiBuildings } from "react-icons/pi";
import { RiHome6Line, RiHome6Fill } from "react-icons/ri";
import { HiOutlineChartPie, HiChartPie } from "react-icons/hi2";
import {
  BsCreditCard2Front,
  BsCreditCard2FrontFill,
  BsPeopleFill,
} from "react-icons/bs";
import { BsPeople } from "react-icons/bs";
import { IoSettings, IoSettingsOutline } from "react-icons/io5";

export default function SideBarMenu() {
  const [activeMenuItem, setActiveMenuItem] = useState("Overview Component");

  const handleMenuItemClick = (component) => {
    setActiveMenuItem(component);
  };

  return (
    <div className="flex-col" style={{ width: "232px" }}>
      <div className="flex-col space-y-6">
        <ProfileComponent
          profileTextOne={"Revenuehub.ng"}
          profileIcon={<FaChevronLeft />}
          profileTextTwo={"Profile"}
          profileTextThree={"Manager"}
          onBackClick={() => {
            alert("Return to Login Page");
          }}
        />
        <div className="flex-col space-y-3">
          <SearchComponent
            placeholder={"Search here"}
            searchIcon={<FiSearch />}
            onSubmit={() => {
              alert("Kindly wait for your Search Results.");
            }}
          />
          <DemandPropertyComponent
            iconOne={<PiListBulletsFill />}
            iconTwo={<PiBuildingsFill />}
            buttonTextOne={"New Demand Invoice"}
            buttonTextTwo={"Add Property"}
            openNewDemandInvoiceModal={() => {
              alert("New Demand Invoice Modal");
            }}
            openAddPropertyModal={() => {
              alert("Add Property Modal");
            }}
          />
        </div>
      </div>
      <hr className="border-0.5 border-divider-grey my-6" />
      <div className="max-h-64 pb-4 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white">
        <div className="flex-col space-y-1">
          <MenuItemComponent
            menuIcon={<RiHome6Line />}
            menuIconTwo={<RiHome6Fill />}
            menuName={"Overview"}
            menuItemCount={0}
            isActive={activeMenuItem === "Overview Component"}
            setComponent={() => {
              handleMenuItemClick("Overview Component");
            }}
          />
          <MenuItemComponent
            menuIcon={<PiBuildings />}
            menuIconTwo={<PiBuildingsFill />}
            menuName={"Properties"}
            menuItemCount={570}
            isActive={activeMenuItem === "Properties Component"}
            setComponent={() => {
              handleMenuItemClick("Properties Component");
            }}
          />
          <MenuItemComponent
            menuIcon={<PiListBulletsBold />}
            menuIconTwo={<PiListBulletsFill />}
            menuName={"Demand Notice"}
            menuItemCount={420}
            isActive={activeMenuItem === "Demand Notice Component"}
            setComponent={() => {
              handleMenuItemClick("Demand Notice Component");
            }}
          />
          <MenuItemComponent
            menuIcon={<HiOutlineChartPie />}
            menuIconTwo={<HiChartPie />}
            menuName={"Statistics"}
            menuItemCount={0}
            isActive={activeMenuItem === "Statistic Component"}
            setComponent={() => {
              handleMenuItemClick("Statistic Component");
            }}
          />
          <MenuItemComponent
            menuIcon={<BsCreditCard2Front />}
            menuIconTwo={<BsCreditCard2FrontFill />}
            menuName={"Transactions"}
            menuItemCount={120}
            isActive={activeMenuItem === "Transactions Component"}
            setComponent={() => {
              handleMenuItemClick("Transactions Component");
            }}
          />
        </div>
        <hr className="border-0.5 border-divider-grey my-3" />
        <div className="flex-col space-y-1">
          <MenuItemComponent
            menuIcon={<BsPeople />}
            menuIconTwo={<BsPeopleFill />}
            menuName={"Staff"}
            menuItemCount={12}
            isActive={activeMenuItem === "Staff Component"}
            setComponent={() => {
              handleMenuItemClick("Staff Component");
            }}
          />
          <MenuItemComponent
            menuIcon={<IoSettingsOutline />}
            menuIconTwo={<IoSettings />}
            menuName={"Settings"}
            menuItemCount={0}
            isActive={activeMenuItem === "Settings Component"}
            setComponent={() => {
              handleMenuItemClick("Settings Component");
            }}
          />
        </div>
      </div>
    </div>
  );
}
