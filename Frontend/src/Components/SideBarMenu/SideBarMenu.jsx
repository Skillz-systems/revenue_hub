import { useState, useEffect } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { PiListBulletsFill, PiBuildingsFill } from "react-icons/pi";
import { dummyData } from "../SearchInput/searchDummyData";
import {
  DemandPropertyButtons,
  ProfileBox,
  SearchInput,
  MenuItem,
  MenuItemData,
} from "../Index";

export default function SideBarMenu({
  hideSideBar,
  searchClicked,
  showAddPropertyModal,
  showAddDemandModal,
  handleMenuItemClick,
  activeMenuItem,
  setActiveComponent,
}) {
  const [displaySearchIcon, setDisplaySearchIcon] = useState(true);
  const [borderState, setBorderState] = useState(false);
  const menuItems = MenuItemData();

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

  let finalBorderStyle = borderState ? changeBoxStyle : "";

  return (
    <div className="flex-col w-full pr-3">
      <div className="flex-col space-y-6">
        <ProfileBox
          profileName={"Revenuehub.ng"}
          profileIcon={<FaChevronLeft />}
          title={"Profile"}
          designation={"Manager"}
          location={"Wuse"}
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
          <DemandPropertyButtons
            iconOne={<PiListBulletsFill />}
            iconTwo={<PiBuildingsFill />}
            buttonTextOne={"New Demand Invoice"}
            buttonTextTwo={"Add Property"}
            openNewDemandInvoiceModal={showAddDemandModal}
            openAddPropertyModal={showAddPropertyModal}
          />
        </div>
      </div>
      <hr className="border-0.5 border-divider-grey my-4" />
      <div className="flex-col space-y-2">
        {menuItems.map((item) => (
          <>
            <MenuItem
              parentDivStyle={""}
              menuId={item.id}
              menuIcon={item.menuIcon}
              menuIconTwo={item.menuIconTwo}
              menuName={item.menuName}
              menuItemCount={item.menuItemCount}
              setComponent={() => {
                handleMenuItemClick(item.componentName);
                setActiveComponent(item.component);
              }}
              route={item.route}
            />
            {item.id === 5 && (
              <div className="py-2">
                <hr className="border-0.5 border-divider-grey" />
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  );
}
