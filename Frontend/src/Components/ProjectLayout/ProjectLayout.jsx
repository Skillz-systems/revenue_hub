import { useState } from "react";
import MenuItemAlt from "../MenuItem/MenuItemAlt";
import { GiHamburgerMenu } from "react-icons/gi";
import { FiSearch } from "react-icons/fi";
import {
  TopNavigation,
  SideBarMenu,
  Card,
  MenuItemData,
  DemandPropertyModal,
  AddProperty,
  AddDemand,
  Overview,
  CardData,
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
  const cardData = CardData();

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
          transitionSection ? "pt-1 w-14" : "w-[230px]"
        } `}
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
                    key={index}
                    menuIcon={item.menuIcon}
                    menuIconTwo={item.menuIconTwo}
                    menuName={item.menuName}
                    isActive={activeMenuItem === item.componentName}
                    setComponent={() => {
                      handleMenuItemClick(item.componentName);
                    }}
                  />
                  {index === 4 && (
                    <hr className="border-0.5 border-divider-grey" />
                  )}
                </>
              ))}
            </div>
          </div>
        )}
      </div>
      <div
        className={`flex-col items-center justify-center p-4 pt-1 space-y-8 bg-white border-0.6 border-b-0 rounded-b-none border-custom-border rounded overflow-auto overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white ${
          transitionSection
            ? "w-full transition-all ease-in-out duration-500"
            : "w-5/6"
        }`}
      >
        <TopNavigation
          userName={"John"}
          handleMenuClick={() => {
            alert("Opened Menu Modal");
          }}
        />
        <Card cardData={cardData} />
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
            "absolute top-0 left-0 z-20 w-full h-screen p-4 overflow-hidden bg-custom-blue-100"
          }
        >
          <AddDemand
            hideAddDemandModal={() => {
              setDisplayAddDemandModal(false);
            }}
          />
        </DemandPropertyModal>
      ) : null}
    </div>
  );
}
