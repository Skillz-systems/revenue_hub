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
} from "../Index";
import Card from "../CardComponents/Card";

export default function ProjectLayout() {
  const [displaySideBarMenu, setdisplaySideBarMenu] = useState(true);
  const [transitionSection, setTransitionSection] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState("Overview Component");
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
      className={`flex relative justify-between h-screen bg-custom-blue-100 lg:p-4 `}
    >
      <div
        className={`${!transitionSection ? "flex w-60" : "flex pt-1 w-14"} `}
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
          />
        ) : (
          <div className="space-y-14" style={{ height: "95vh" }}>
            <div
              className=""
              style={{
                height: "20vh",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
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
            <div
              className="space-y-5 w-9"
              style={{
                height: "55vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
              }}
            >
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
        className={`flex-col bg-white border-0.6 border-custom-border rounded ${
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
        {/* <Card
          icon={<img src="path/to/icon.png" alt="Icon" />}
          height="25%"
          width="100%"
          title="Custom Title"
          subtitle="Custom Subtitle"
          value="Custom Value"
        /> */}
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
