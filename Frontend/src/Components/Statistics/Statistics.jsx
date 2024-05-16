import React, { useState } from "react";

export default function Statistics() {
  const [invoiceFilterState, setInvoiceFilterState] = useState("day");
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonth, setSelectedMonth] = useState("November");

  const handleDayClick = () => {
    setInvoiceFilterState("day");
  };

  const handleWeekClick = () => {
    setInvoiceFilterState("week");
  };

  const handleMonthClick = () => {
    setInvoiceFilterState("month");
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="flex-col space-y-8 pb-14">
      <hr className="border-0.5 mb-8 border-custom-grey-100" />
      <div className="flex-col border-0.6 w-full border-custom-color-one shadow rounded">
        <div className="flex items-center justify-between px-4 py-2 bg-color-light-green ">
          <p className="text-base font-bold font-lexend text-color-text-one">
            Invoice Generated
          </p>
          <div className="flex items-center gap-3 text-xs font-lexend">
            <span
              className={`cursor-pointer ${
                invoiceFilterState === "day"
                  ? "text-color-dark-red font-bold"
                  : "text-color-text-two"
              }`}
              onClick={handleDayClick}
            >
              Day
            </span>
            <span
              className={`cursor-pointer ${
                invoiceFilterState === "week"
                  ? "text-color-dark-red font-bold"
                  : "text-color-text-two"
              }`}
              onClick={handleWeekClick}
            >
              Week
            </span>
            <span
              className={`cursor-pointer ${
                invoiceFilterState === "month"
                  ? "text-color-dark-red font-bold"
                  : "text-color-text-two"
              }`}
              onClick={handleMonthClick}
            >
              Month
            </span>
            <select
              className="p-2 overflow-y-auto font-medium leading-tight border rounded outline-none text-color-text-two font-lexend bg-inherit border-divider-grey overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white"
              onChange={handleMonthChange}
              value={selectedMonth}
            >
              {months.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select
              className="p-2 overflow-y-auto font-medium leading-tight border rounded outline-none text-color-text-two font-lexend bg-inherit border-divider-grey overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white"
              onChange={handleYearChange}
              value={selectedYear}
            >
              {Array.from({ length: 25 }, (_, index) => (
                <option key={index} value={2000 + index}>
                  {2000 + index}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="flex gap-2 px-4 py-2 text-xs font-bold border-b bg-very-light-grey border-custom-color-one font-lexend text-color-text-two">
          LAST DAILY TOTAL
          <span className="text-color-text-black">112</span>
        </p>
        <div className="flex-col p-4 bg-very-light-grey">CHART 1</div>
      </div>

      <div className="flex-col border-0.6 w-full border-custom-color-one shadow rounded">
        <div className="flex items-center justify-between px-4 py-2 bg-color-light-yellow">
          <p className="text-base font-bold font-lexend text-color-text-one">
            Value Generated
          </p>
          <div className="flex items-center gap-3 text-xs font-lexend">
            <span
              className={`cursor-pointer ${
                invoiceFilterState === "day"
                  ? "text-color-dark-red font-bold"
                  : "text-color-text-two"
              }`}
              onClick={handleDayClick}
            >
              Day
            </span>
            <span
              className={`cursor-pointer ${
                invoiceFilterState === "week"
                  ? "text-color-dark-red font-bold"
                  : "text-color-text-two"
              }`}
              onClick={handleWeekClick}
            >
              Week
            </span>
            <span
              className={`cursor-pointer ${
                invoiceFilterState === "month"
                  ? "text-color-dark-red font-bold"
                  : "text-color-text-two"
              }`}
              onClick={handleMonthClick}
            >
              Month
            </span>
            <select
              className="p-2 overflow-y-auto font-medium leading-tight border rounded outline-none text-color-text-two font-lexend bg-inherit border-divider-grey overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white"
              onChange={handleMonthChange}
              value={selectedMonth}
            >
              {months.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select
              className="p-2 overflow-y-auto font-medium leading-tight border rounded outline-none text-color-text-two font-lexend bg-inherit border-divider-grey overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white"
              onChange={handleYearChange}
              value={selectedYear}
            >
              {Array.from({ length: 25 }, (_, index) => (
                <option key={index} value={2000 + index}>
                  {2000 + index}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-4 py-2 text-xs border-b bg-very-light-grey border-custom-color-one font-mulish text-color-text-one">
          <div className="flex items-center gap-1">
            <span className="w-[13px] h-[13px] bg-primary-color"></span>
            <span>Invoices Generated</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-[13px] h-[13px] bg-color-dark-red"></span>
            <span>Payments Received</span>
          </div>
        </div>
        <div className="flex-col p-4 bg-very-light-grey">CHART 1</div>
      </div>
    </div>
  );
}
