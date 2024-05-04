import React, { useState } from "react";
import { TbCalendarDot } from "react-icons/tb";
import { FaChevronDown } from "react-icons/fa";

export default function TopNavigation({ userName, handleMenuClick }) {
  const [selectedYear, setSelectedYear] = useState(2024);

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
    alert(`Retrieving ${event.target.value} Revenue Data`);
  };

  const getCurrentDate = () => {
    const getDaySuffix = (day) => {
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

  return (
    <div className="flex items-center justify-between p-4 border-b-0.6 border-custom-border">
      <div className="flex-col w-auto">
        <h2 className="text-base font-bold">Welcome {userName},</h2>
        <p className="text-xs text-color-text-two font-lexend">
          {getCurrentDate()}
        </p>
      </div>
      <div className="flex gap-4 w-auto">
        <div className="flex relative">
          <select
            className="w-24 p-2 font-lexend appearance-none outline-none bg-custom-blue-100 border-o.6 border-custom-border shadow leading-tight rounded overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white"
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
          className="text-base text-color-text-two flex items-center p-2 border-0.6 border-custom-border rounded bg-inherit hover:cursor-pointer"
          title="Menu"
          onClick={handleMenuClick}
        >
          <FaChevronDown />
        </span>
      </div>
    </div>
  );
}
