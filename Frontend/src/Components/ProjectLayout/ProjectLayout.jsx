import { useState } from "react";
import MenuItemAlt from "../MenuItem/MenuItemAlt";
import { GiHamburgerMenu } from "react-icons/gi";
import { FiSearch } from "react-icons/fi";
import {
  TopNavigation,
  SideBarMenu,
  MenuItemData,
  DemandPropertyModal,
  AddProperty,
  AddDemand,
  Overview,
} from "../Index";

export default function ProjectLayout() {
  const [displaySideBarMenu, setdisplaySideBarMenu] = useState(true);
  const [transitionSection, setTransitionSection] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState("Overview Component");
  const [activeComponent, setActiveComponent] = useState(<Overview />);
  const [searchClicked, setSearchClicked] = useState(false);
  const [displayAddPropertyModal, setDisplayAddPropertyModal] = useState(false);
  const [displayAddDemandModal, setDisplayAddDemandModal] = useState(false);
  const [propertyModalTransition, setPropertyModalTransition] = useState(false);
  const menuItems = MenuItemData();

  const handleMenuItemClick = (component) => {
    setActiveMenuItem(component);
  };

  const hideSideBar = () => {
    setdisplaySideBarMenu(false);
    setTimeout(() => {
      setTransitionSection(true);
    }, 250);
  };
  const showSideBar = () => {
    setdisplaySideBarMenu(true);
    setTransitionSection(false);
  };

  const handleSearchClick = () => {
    showSideBar();
    setSearchClicked(true);
  };

  return (
    <div
      className={`flex relative justify-between h-screen bg-custom-blue-100 lg:p-4 lg:pb-0 `}
    >
      <div
        className={`flex-col pb-6 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white ${
          transitionSection ? "pt-1 w-14" : "w-[19%]"
        }
        ${
          activeMenuItem === "Settings Component" &&
          displaySideBarMenu === false
            ? "pt-1 w-14"
            : activeMenuItem === "Settings Component"
            ? "w-[270px]"
            : ""
        } 
        `}
      >
        {displaySideBarMenu === true ? (
          <SideBarMenu
            hideSideBar={hideSideBar}
            searchClicked={searchClicked}
            showAddPropertyModal={() => {
              setDisplayAddPropertyModal(true);
              setTimeout(() => {
                setPropertyModalTransition(true);
              }, 250);
            }}
            showAddDemandModal={() => {
              setDisplayAddDemandModal(true);
              setTimeout(() => {
                setPropertyModalTransition(true);
              }, 250);
            }}
            handleMenuItemClick={handleMenuItemClick}
            activeMenuItem={activeMenuItem}
            setActiveComponent={setActiveComponent}
          />
        ) : (
          <div className="space-y-14 w-9">
            <div className="flex-col space-y-4">
              <span
                className="flex items-center justify-center text-2xl w-9 text-primary-color"
                title="Expand Sidebar Menu"
                onClick={showSideBar}
              >
                <GiHamburgerMenu />
              </span>
              <span
                className="flex items-center justify-center text-2xl w-9 text-primary-color"
                title="Expand Search Bar"
                onClick={handleSearchClick}
              >
                <FiSearch />
              </span>
            </div>
            <div className="flex-col space-y-5 justify-evenly w-9">
              {menuItems.map((item, index) => (
                <>
                  <MenuItemAlt
                    menuId={index}
                    menuIcon={item.menuIcon}
                    menuIconTwo={item.menuIconTwo}
                    menuName={item.menuName}
                    isActive={activeMenuItem === item.componentName}
                    setComponent={() => {
                      handleMenuItemClick(item.componentName);
                      setActiveComponent(item.component);
                    }}
                  />
                  {item.id === 4 && (
                    <div className="py-2">
                      <hr className="border-0.5 border-divider-grey" />
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>
        )}
      </div>

      {activeMenuItem === "Settings Component" ? (
        <div className="flex-col px-4 space-y-2 w-[200px] text-color-text-on font-lexend border-l-0.5 border-divider-grey">
          <div
            className="p-2 text-xs rounded border-0.6 border-custom-color-two hover:bg-primary-color hover:text-white hover:cursor-pointer"
            title="Your account information"
            onClick={() => alert("Account Page")}
          >
            Your Account
          </div>
          <div
            className="p-2 text-xs rounded border-0.6 border-custom-color-two hover:bg-primary-color hover:text-white hover:cursor-pointer"
            title="Change your password"
            onClick={() => alert("Password Page")}
          >
            Change Password
          </div>
        </div>
      ) : null}

      <div
        className={`flex-col items-center justify-center p-4 pt-1 space-y-8 bg-white border-0.6 border-b-0 rounded-b-none border-custom-border rounded overflow-auto overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white ${
          transitionSection
            ? "w-full transition-all ease-in-out duration-500"
            : "w-[81%]"
        }`}
      >
        <TopNavigation
          userName={"John"}
          handleMenuClick={() => {
            alert("Opened Menu Modal");
          }}
        />
        {activeComponent}
      </div>

      {displayAddPropertyModal ? (
        <DemandPropertyModal
          modalStyle={
            "absolute top-0 left-0 z-20 flex items-start justify-end w-full h-screen p-4 overflow-hidden bg-black bg-opacity-40"
          }
        >
          <AddProperty
            hideAddPropertyModal={() => {
              setDisplayAddPropertyModal(false);
              setTimeout(() => {
                setPropertyModalTransition(false);
              }, 300);
            }}
            propertyModalTransition={propertyModalTransition}
          />
        </DemandPropertyModal>
      ) : null}

      {displayAddDemandModal ? (
        <DemandPropertyModal
          modalStyle={
            "absolute top-0 left-0 z-20 flex items-start justify-end w-full h-screen p-4 overflow-hidden bg-black bg-opacity-40"
          }
        >
          <AddDemand
            hideAddDemandModal={() => {
              setDisplayAddDemandModal(false);
              setTimeout(() => {
                setPropertyModalTransition(false);
              }, 300);
            }}
            propertyModalTransition={propertyModalTransition}
          />
        </DemandPropertyModal>
      ) : null}
    </div>
  );
}
