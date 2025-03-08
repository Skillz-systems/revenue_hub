import React, { useState, useEffect } from "react";
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
  userData,
  CustomAlert,
} from "../Index";

interface SideBarMenuProps {
  hideSideBar: () => void;
  searchClicked: boolean;
  showAddPropertyModal: () => void;
  showAddDemandModal: () => void;
  handleMenuItemClick: (componentName: string) => void;
  activeMenuItem: string;
  setActiveComponent: (component: React.ReactNode) => void;
}

const SideBarMenu: React.FC<SideBarMenuProps> = ({
  hideSideBar,
  searchClicked,
  showAddPropertyModal,
  showAddDemandModal,
  handleMenuItemClick,
  activeMenuItem,
  setActiveComponent,
}) => {
  const [displaySearchIcon, setDisplaySearchIcon] = useState<boolean>(true);
  const [borderState, setBorderState] = useState<boolean>(false);
  const menuItems = MenuItemData();
  const { accountInformation } = userData();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    let timeout: any;
    if (searchClicked) {
      setBorderState(true);
      timeout = setTimeout(() => {
        setBorderState(false);
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [searchClicked]);

  const changeBoxStyle: string = searchClicked
    ? "border-1.5 border-custom-color-two shadow-custom-100"
    : "";

  const finalBorderStyle: string = borderState ? changeBoxStyle : "";

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="flex-col w-full pr-3">
      <div className="flex-col space-y-6">
        <ProfileBox
          profileName={"Revenuehub.ng"}
          profileIcon={<FaChevronLeft />}
          title={"Profile"}
          designation={accountInformation?.role.name}
          location={accountInformation?.zone}
          onHideSideBarMenu={hideSideBar}
        />
        <div className="flex-col space-y-3">
          <SearchInput
            parentBoxStyle={`flex items-center justify-between px-4 py-2.5 bg-custom-grey-100 rounded-3xl border border-custom-color-one ${finalBorderStyle}`}
            inputBoxStyle={`${displaySearchIcon ? "w-10/12" : "w-full"
              } text-xs outline-none bg-inherit font-lexend text-color-text-two`}
            iconBoxStyle={"text-base text-primary-color hover:cursor-pointer"}
            placeholder={"Search here"}
            searchIcon={<FiSearch />}
            handleOnInput={(event: React.ChangeEvent<HTMLInputElement>) => {
              event.preventDefault();
              if (event.target.value) {
                setDisplaySearchIcon(false);
              } else {
                setDisplaySearchIcon(true);
              }
            }}
            handleSearch={(value: string) => {
              alert(`Opened Information on ${value}`);
            }}
            displaySearchIcon={displaySearchIcon}
            dummyData={dummyData}
          />
          <DemandPropertyButtons
            iconOne={<PiListBulletsFill />}
            iconTwo={<PiBuildingsFill />}
            buttonTextOne={"Batch Demand Notice"}
            buttonTextTwo={"Add Property"}
            openNewDemandInvoiceModal={() => {
              //hideSideBar();
              showAddDemandModal();

            }}
            openAddPropertyModal={() => {
              setSnackbar({
                open: true,
                message: "Disabled Feature. Coming soon.",
                severity: "warning",
              });
            }}
          />
        </div>
      </div>
      <hr className="border-0.5 border-divider-grey my-4" />
      <div className="flex-col space-y-2">
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
          </React.Fragment>
        ))}
      </div>
      <CustomAlert
        isOpen={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        handleClose={handleSnackbarClose}
      />
    </div>
  );
};

export default SideBarMenu;