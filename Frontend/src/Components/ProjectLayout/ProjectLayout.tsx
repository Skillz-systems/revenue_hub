import React, { useState, useEffect } from "react";
import MenuItemAlt from "../MenuItem/MenuItemAlt";
import { GiHamburgerMenu } from "react-icons/gi";
import { FiSearch } from "react-icons/fi";
import { IoIosReturnLeft } from "react-icons/io";
import {
  TopNavigation,
  SideBarMenu,
  MenuItemData,
  DemandPropertyModal,
  AddProperty,
  AddDemand,
  Overview,
  Accounts,
  Password,
  Settings,
  userData,
  Card,
  CardData,
  CustomAlert,
} from "../Index";

const ProjectLayout: React.FC = () => {
  const [displaySideBarMenu, setDisplaySideBarMenu] = useState<boolean>(true);
  const [transitionSection, setTransitionSection] = useState<boolean>(false);
  const [activeMenuItem, setActiveMenuItem] =
    useState<string>("Overview Component");
  const [activeComponent, setActiveComponent] = useState<React.ReactNode>(
    <Overview />
  );
  const [searchClicked, setSearchClicked] = useState<boolean>(false);
  const [displayAddPropertyModal, setDisplayAddPropertyModal] =
    useState<boolean>(false);
  const [displayAddDemandModal, setDisplayAddDemandModal] =
    useState<boolean>(false);
  const [propertyModalTransition, setPropertyModalTransition] =
    useState<boolean>(false);
  const [accountsPasswordState, setAccountsPasswordState] =
    useState<string>("");
  const menuItems = MenuItemData();
  const { accountInformation, statistics } = userData();
  const cardData = CardData();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleMenuItemClick = (component: string) => {
    setActiveMenuItem(component);
    setAccountsPasswordState("");
  };

  const hideSideBar = () => {
    setDisplaySideBarMenu(false);
    setTimeout(() => {
      setTransitionSection(true);
    }, 250);
  };
  const showSideBar = () => {
    setDisplaySideBarMenu(true);
    setTransitionSection(false);
  };

  const handleSearchClick = () => {
    showSideBar();
    setSearchClicked(true);
  };

  const showSnackBar = () => {
    setSnackbar({
      open: true,
      message: "Disabled Feature. Statistics Coming soon.",
      severity: "warning",
    });
  };

  useEffect(() => {
    if (activeMenuItem === "Statistic Component") {
      showSnackBar();
    } else {
      return;
    }
  }, [activeMenuItem]);

  return (
    <>
      {!accountInformation && !statistics ? (
        <div className="flex flex-col items-center justify-center h-screen gap-2 bg-custom-blue-100">
          <h1 className="text-lg font-lexend">Loading Dashboard</h1>
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            {/* <span className="sr-only">Loading...</span> */}
          </div>
        </div>
      ) : (
        <div
          className={`flex relative justify-between h-screen bg-custom-blue-100 lg:p-4 lg:pb-0 `}
        >
          <div
            className={`hidden lg:flex lg:flex-col pb-6 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white ${
              transitionSection ? "pt-1 w-14" : "w-[19%]"
            } ${
              activeMenuItem === "Settings Component" && !displaySideBarMenu
                ? "pt-1 w-14"
                : activeMenuItem === "Settings Component"
                ? "w-[270px]"
                : ""
            }`}
          >
            {displaySideBarMenu ? (
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
                    <React.Fragment key={index}>
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
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>

          {activeMenuItem === "Settings Component" ? (
            <div className="flex-col px-4 space-y-2 w-[200px] text-color-text-on font-lexend border-l-0.5 border-divider-grey">
              <div
                className={`p-2 text-xs rounded border-0.6 border-custom-color-two hover:bg-primary-color hover:text-white hover:cursor-pointer ${
                  accountsPasswordState === "Accounts" &&
                  "bg-primary-color text-white"
                }`}
                title="Your account information"
                onClick={() => {
                  setActiveComponent(null);
                  setAccountsPasswordState("Accounts");
                }}
              >
                Your Account
              </div>
              <div
                className={`p-2 text-xs rounded border-0.6 border-custom-color-two hover:bg-primary-color hover:text-white hover:cursor-pointer ${
                  accountsPasswordState === "Password" &&
                  "bg-primary-color text-white"
                }`}
                title="Change your password"
                onClick={() => {
                  setActiveComponent(null);
                  setAccountsPasswordState("Password");
                }}
              >
                Change Password
              </div>
              {accountsPasswordState ? (
                <p
                  className="flex items-center gap-1 pt-2 text-[11px] text-color-dark-red hover:cursor-pointer"
                  onClick={() => {
                    setAccountsPasswordState("return");
                    setActiveComponent(<Settings />);
                  }}
                >
                  <span>
                    <IoIosReturnLeft />
                  </span>
                  Return to Dashboard
                </p>
              ) : null}
            </div>
          ) : null}

          <div
            className={`flex-col items-center justify-center p-4 pt-1 space-y-8 bg-white border-0.6 border-b-0 rounded-b-none border-custom-border rounded overflow-auto overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white ${
              transitionSection
                ? "w-full transition-all ease-in-out duration-500"
                : "w-full lg:w-[81%]"
            }`}
          >
            <TopNavigation
              parentStyle={""}
              userName={accountInformation?.name}
              handleViewProfile={() => {
                setActiveMenuItem("Settings Component");
                setActiveComponent(null);
                setAccountsPasswordState("Accounts");
              }}
            />

            {activeMenuItem === "Settings Component" ? null : (
              <div className="grid grid-cols-2 gap-x-3 gap-y-3 md:grid-cols-3 md:gap-x-4 md:gap-y-8">
                {cardData.map((card) => (
                  <Card
                    id={card.id}
                    icon={card.icon}
                    description={card.description}
                    name={card.name}
                    value={card.value}
                    containerStyle={`flex flex-col items-start p-2 space-y-4 lg:p-4 lg:space-y-8 border-0.6 w-full border-custom-color-one shadow rounded
                ${card.id === 1 && "bg-custom-grey-200"}`}
                    iconStyle={`flex items-center justify-center w-6 lg:w-10 h-6 lg:h-10 lg:p-2 text-base lg:text-2xl rounded 
                ${
                  [1, 2, 3].includes(card.id) &&
                  "bg-custom-blue-200 text-primary-color"
                }
                ${card.id === 4 && "bg-color-light-green text-color-dark-green"}
                  ${
                    [5, 6].includes(card.id) &&
                    "bg-color-light-yellow text-color-bright-orange"
                  }
                  `}
                    descriptionStyle={
                      "text-[10px] lg:text-xs text-color-text-two font-lexend"
                    }
                    nameStyle={
                      "text-xs lg:text-sm font-medium lg:font-semibold text-color-text-one font-lexend"
                    }
                    currencyStyle={
                      "text-sm lg:text-2xl text-color-bright-green"
                    }
                    valueStyle={"text-lg lg:text-3xl"}
                  />
                ))}
              </div>
            )}

            {activeComponent ? (
              activeMenuItem === "Statistic Component" ? (
                <div></div>
              ) : (
                activeComponent
              )
            ) : accountsPasswordState === "Accounts" ? (
              <div className="flex items-center justify-center">
                <Accounts currentUserData={accountInformation} />
              </div>
            ) : accountsPasswordState === "Password" ? (
              <div className="flex items-center justify-center ">
                <Password userEmail={accountInformation?.email} />
              </div>
            ) : (
              activeComponent
            )}
          </div>

          {(displayAddPropertyModal || displayAddDemandModal) && (
            <DemandPropertyModal
              modalStyle={
                "absolute top-0 left-0 z-20 flex items-start justify-end w-full h-screen p-4 overflow-hidden bg-black bg-opacity-40"
              }
            >
              {displayAddPropertyModal && (
                <AddProperty
                  hideAddPropertyModal={() => {
                    setDisplayAddPropertyModal(false);
                    setTimeout(() => {
                      setPropertyModalTransition(false);
                    }, 300);
                  }}
                  propertyModalTransition={propertyModalTransition}
                />
              )}
              {displayAddDemandModal && (
                <AddDemand
                  hideAddDemandModal={() => {
                    setDisplayAddDemandModal(false);
                    setTimeout(() => {
                      setPropertyModalTransition(false);
                    }, 300);
                  }}
                  propertyModalTransition={propertyModalTransition}
                />
              )}
            </DemandPropertyModal>
          )}
          <CustomAlert
            isOpen={snackbar.open}
            message={snackbar.message}
            severity={snackbar.severity}
            handleClose={handleSnackbarClose}
          />
        </div>
      )}
    </>
  );
};

export default ProjectLayout;
