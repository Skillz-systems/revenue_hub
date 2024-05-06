import { useState } from "react";
import MenuItemAlt from "../MenuItem/MenuItemAlt";
import { GiHamburgerMenu } from "react-icons/gi";
import { FiSearch } from "react-icons/fi";
import MenuItemData from "../MenuItem/MenuItemData";
import {Card} from "../Index";
import SideBarMenu from "../../Pages/SideBarMenu/SideBarMenu";
import images from '../../assets/index';
import TopNavigation from "../TopNavigation/TopNavigation";
import PropertyCard from "../PropertyCard/PropertyCard";


export default function ProjectLayout() {
  const [displaySideBarMenu, setdisplaySideBarMenu] = useState(true);
  const [transitionSection, setTransitionSection] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState("Overview Component");
  const [searchClicked, setSearchClicked] = useState(false);
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
    <div className={`flex justify-between h-screen bg-custom-blue-100 lg:p-4 `}>
      <div
        className={`${!transitionSection ? "flex w-60" : "flex pt-1 w-14"} `}
      >
        {displaySideBarMenu === true ? (
          <SideBarMenu
            hideSideBar={hideSideBar}
            searchClicked={searchClicked}
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
        className={`flex-col p-4 bg-white border-0.6 border-custom-border rounded ${
          transitionSection
            ? "w-full transition-all ease-in-out duration-500"
            : "w-5/6"
        }`}
      >
        <div className="grid grid-cols-2 gap-4">
          <div><Card
        icon={<img src={images.Shieldblue} alt="Icon" />}
        title="Value of Generated"
        subtitle="Demand notice"
        value="4,400,000.00"
        withSymbol= {true}
        datepicker={true}
        dateContent="April, 2024"
      /></div>
          <div><Card
        icon={<img src={images.Shieldblue} alt="Icon" />}
        title="Value of Generated"
        subtitle="Demand notice"
        value="4,400,000.00"
        style='bg-white'
        dateContent="April, 2024"
      /></div>
          <div><Card
        icon={<img src={images.Shieldblue} alt="Icon" />}
        title="Value of Generated"
        subtitle="Demand notice"
        value="4,400,000.00"
        withSymbol= {true}
        datepicker={true}
        dateContent="April, 2024"
      /></div>
        </div>
        
        <PropertyCard />
        RIGHT
      </div>
    </div>
  );
}
