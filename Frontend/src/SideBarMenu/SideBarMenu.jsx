import { useState, useEffect } from "react";
import ProfileBox from "../Components/ProfileBox/ProfileBox";
import SearchInput from "../Components/SearchInput/SearchInput";
import DemandProperty from "../Components/DemandProperty.jsx/DemandProperty";
import MenuItem from "../Components/MenuItem/MenuItem";
import { FaChevronLeft } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { PiListBulletsFill, PiBuildingsFill } from "react-icons/pi";
import MenuItemData from "../Components/MenuItem/MenuItemData";
import { dummyData } from "../Components/SearchInput/searchDummyData";

export default function SideBarMenu({ hideSideBar, searchClicked }) {
  const [activeMenuItem, setActiveMenuItem] = useState("Overview Component");
  const [displaySearchIcon, setDisplaySearchIcon] = useState(true);
  const [borderState, setBorderState] = useState(false);

  const menuItems = MenuItemData();

  const handleMenuItemClick = (component) => {
    setActiveMenuItem(component);
  };

  const dividerLogic = (index) => {
    if (index === 4) {
      return "mb-3";
    }
    if (index === 5) {
      return "mt-3";
    }
    return "";
  };

  useEffect(() => {
    let timeout;
    if (searchClicked) {
      setBorderState(true);
      console.log("TRUE");
      timeout = setTimeout(() => {
        setBorderState(false);
        console.log("FALSE");
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, []);

  const changeBoxStyle = searchClicked
    ? "border-1.5 border-custom-color-two shadow-custom-100"
    : "";

  let finalBorderStyle = borderState
    ? changeBoxStyle
    : "border-custom-color-one";

  return (
    <div
      className="flex-col w-full pb-6 pr-4 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white "
      style={{ height: "95vh" }}
    >
      <div className="flex-col space-y-6">
        <ProfileBox
          profileName={"Revenuehub.ng"}
          profileIcon={<FaChevronLeft />}
          title={"Profile"}
          designation={"Manager"}
          onHideSideBarMenu={hideSideBar}
        />
        <div className="flex-col space-y-3">
          <SearchInput
            parentBoxStyle={`flex items-center justify-between px-4 py-2.5 bg-custom-grey-100 rounded-3xl border border-custom-color-one ${finalBorderStyle}`}
            inputBoxStyle={` ${
              displaySearchIcon ? "w-10/12" : "w-full"
            } text-xs outline-none bg-inherit font-lexend text-color-text-two`}
            iconBoxStyle={"text-base text-primary-color hover:cursor-pointer"}
            placeholder={"Search here"}
            searchIcon={<FiSearch />}
            handleOnInput={(event) => {
              event.preventDefault();
              if (event.target.value) {
                setDisplaySearchIcon(false);
              } else {
                setDisplaySearchIcon(true);
              }
            }}
            handleSearch={(value) => {
              alert(`Opened Information on ${value}`);
            }}
            displaySearchIcon={displaySearchIcon}
            dummyData={dummyData}
          />
          <DemandProperty
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
      <hr className="border-0.5 border-divider-grey my-4" />
      <div className="">
        {menuItems.map((item, index) => (
          <div className="flex-col space-y-1.5">
            <MenuItem
              key={index}
              parentDivStyle={`${dividerLogic(index)}`}
              menuIcon={item.menuIcon}
              menuIconTwo={item.menuIconTwo}
              menuName={item.menuName}
              menuItemCount={item.menuItemCount}
              isActive={activeMenuItem === item.componentName}
              setComponent={() => {
                handleMenuItemClick(item.componentName);
              }}
            />
            {index === 4 && <hr className="border-0.5 border-divider-grey" />}
          </div>
        ))}
      </div>
    </div>
  );
}
