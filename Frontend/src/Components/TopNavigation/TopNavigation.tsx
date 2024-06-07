import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbCalendarDot } from "react-icons/tb";
import { FaChevronDown } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { GrPowerShutdown } from "react-icons/gr";
import { GiHamburgerMenu } from "react-icons/gi";
import Cookies from "js-cookie";
import { CustomAlert } from "../Index";

interface TopNavigationProps {
  userName: string;
  handleViewProfile: () => void;
  parentStyle: string;
}

const TopNavigation: React.FC<TopNavigationProps> = ({
  userName,
  handleViewProfile,
  parentStyle,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [menuState, setMenuState] = useState<boolean>(false);
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const displayMenu = () => {
    setMenuState(!menuState);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const getCurrentDate = () => {
    const getDaySuffix = (day: number) => {
      if (day >= 11 && day <= 13) {
        return "th";
      }
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "long" });
    const year = date.getFullYear();

    // Get the correct suffix for the day
    const daySuffix = getDaySuffix(day);

    // Format the date components
    const formattedDate = `${day}${daySuffix} ${month}, ${year}`;
    return formattedDate;
  };

  const handleLogout = () => {
    Cookies.remove("userToken");
    navigate("/login");
  };

  return (
    <div
      className={`flex items-center justify-between p-4 border-b-0.6 border-custom-border rounded-t ${parentStyle}`}
    >
      <div className="flex-col w-auto">
        <h2 className="text-base font-bold">Welcome {userName},</h2>
        <p className="text-xs text-color-text-two font-lexend">
          {getCurrentDate()}
        </p>
      </div>
      <div className="flex text-3xl lg:hidden">
        <GiHamburgerMenu />
      </div>
      <div className="hidden w-auto gap-4 lg:flex">
        <div
          className="relative flex"
          onClick={() => {
            setSnackbar({
              open: true,
              message: "Disabled Feature. Coming soon.",
              severity: "warning",
            });
          }}
        >
          <select
            className="w-24 p-2 font-lexend appearance-none outline-none bg-custom-blue-100 border-0.6 border-custom-border shadow leading-tight rounded overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white pointer-events-none"
            onChange={handleYearChange}
            value={selectedYear}
          >
            {Array.from({ length: 25 }, (_, index) => (
              <option key={index} value={2000 + index} className="text-sm">
                {2000 + index}
              </option>
            ))}
          </select>
          <span className="text-lg text-color-text-two pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 border-l-0.6 border-custom-border">
            <TbCalendarDot />
          </span>
        </div>
        <span
          className="text-base relative text-color-text-two flex items-center p-2 border-0.6 border-custom-border rounded bg-inherit hover:cursor-pointer"
          onClick={displayMenu}
        >
          <span title="Menu">
            <FaChevronDown />
          </span>
          {menuState ? (
            <span
              className="absolute space-y-2 top-0 z-10 flex-col w-36 p-4 text-xs bg-white rounded shadow-md -left-40 border-0.6 border-custom-grey-100 text-color-text-black font-lexend"
              onMouseLeave={displayMenu}
            >
              <p
                className="flex items-center justify-between hover:cursor-pointer"
                title="View Profile"
                onClick={handleViewProfile}
              >
                View Profile
                <span className="text-base text-primary-color">
                  <IoPersonCircle />
                </span>
              </p>
              <p
                className="flex items-center justify-between hover:cursor-pointer"
                title="Logout"
                onClick={handleLogout}
              >
                Logout
                <span className="text-base text-color-dark-red">
                  <GrPowerShutdown />
                </span>
              </p>
            </span>
          ) : null}
        </span>
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

export default TopNavigation;
