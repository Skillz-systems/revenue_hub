import React from "react";
import {
  DemandPropertyButtons,
  MenuItem,
  MenuItemData,
  ProfileBox,
  userData,
} from "../Index";
import { FaChevronLeft } from "react-icons/fa";
import { PiBuildingsFill, PiListBulletsFill } from "react-icons/pi";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { GrPowerShutdown } from "react-icons/gr";

interface SideBarMenuProps {
  hideSideBar: () => void;
  showAddPropertyModal: () => void;
  showAddDemandModal: () => void;
  handleMenuItemClick: (componentName: string) => void;
  activeMenuItem: string;
  setActiveComponent: (component: React.ReactNode) => void;
  handleViewProfile: () => void;
}

const SibeBarMenuMobile: React.FC<SideBarMenuProps> = ({
  hideSideBar,
  showAddDemandModal,
  showAddPropertyModal,
  handleMenuItemClick,
  activeMenuItem,
  setActiveComponent,
  handleViewProfile,
}) => {
  const { accountInformation } = userData();
  const menuItems = MenuItemData();
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("userData");
    navigate("/login");
  };

  const isMobile: boolean = true;

  return (
    <div className="flex-col w-[200px] sm:w-[225px] items-start justify-end h-screen overflow-y-auto bg-white lg:hidden overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white">
      <div className="flex-col w-full px-2.5 py-2 space-y-6">
        <ProfileBox
          profileName={"Revenuehub.ng"}
          profileIcon={<FaChevronLeft />}
          title={isMobile ? "View Profile" : "Profile"}
          designation={accountInformation?.role.name}
          location={accountInformation?.zone}
          onHideSideBarMenu={hideSideBar}
          handleViewProfile={handleViewProfile}
        />
        <DemandPropertyButtons
          iconOne={<PiListBulletsFill />}
          iconTwo={<PiBuildingsFill />}
          buttonTextOne={"New Demand Invoice"}
          buttonTextTwo={"Add Property"}
          openNewDemandInvoiceModal={() => {
            hideSideBar();
            showAddDemandModal();
          }}
          openAddPropertyModal={() => {
            hideSideBar();
            showAddPropertyModal();
          }}
        />
        <hr className="border-0.5 border-divider-grey my-4" />
        <div className="flex-col pb-5 space-y-2">
          {menuItems.map((item) => (
            <React.Fragment key={item.id}>
              <MenuItem
                parentDivStyle={""}
                menuId={item.id}
                menuIcon={item.menuIcon}
                menuIconTwo={item.menuIconTwo}
                menuName={item.menuName}
                menuItemCount={item.menuItemCount}
                isActive={activeMenuItem === item.componentName}
                setComponent={() => {
                  handleMenuItemClick(item.componentName);
                  setActiveComponent(item.component);
                }}
              />
              {item.id === 5 && (
                <div className="py-2">
                  <hr className="border-0.5 border-divider-grey" />
                </div>
              )}
              {item.id === 7 && (
                <>
                  <div className="py-2">
                    <hr className="border-0.5 border-divider-grey" />
                  </div>
                  <p
                    className="flex items-center justify-between gap-2 px-1.5 py-2 hover:cursor-pointer font-lexend"
                    title="Logout"
                    onClick={handleLogout}
                  >
                    <span className="text-2xl text-color-dark-red">
                      <GrPowerShutdown />
                    </span>
                    <span className="w-full text-xs font-medium text-color-dark-red">
                      Logout
                    </span>
                  </p>
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SibeBarMenuMobile;
