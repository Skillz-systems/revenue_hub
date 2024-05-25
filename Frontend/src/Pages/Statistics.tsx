import React, { useState, useEffect } from "react";
import { Card, CardData } from "../Components/Index";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Dot,
} from 'recharts';


const Month: string[] = [
  "Select Month",
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

const Statistics: React.FC = () => {
  const cardData = CardData();
  const [invoiceChartState, setInvoiceChartState] = useState<string>("Day");
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedMonth, setSelectedMonth] = useState<string>(Month[0]);
  const [valueChartState, setValueChartState] = useState<string>("Day");
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [invoicePayload, setInvoicePayload] = useState<string | null>(null);
  const [invoiceChartData, setInvoiceChartData] = useState<any[]>([]);
  const [valueChartData, setValueChartData] = useState<any[]>([]);

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
  };

  // Generate random data for the chart
  const generateInvoiceData = (type: string) => {
    if (type === "Day") {
      return Array.from({ length: 30 }, (_, i) => ({
        name: `Day ${i + 1}`,
        value: Math.floor(Math.random() * 25) + 1
      }));
    } else if (type === "Week") {
      return Array.from({ length: 4 }, (_, i) => ({
        name: `Week ${i + 1}`,
        value: Math.floor(Math.random() * 25) + 1
      }));
    } else {
      return Month.map((month, i) => ({
        name: month,
        value: Math.floor(Math.random() * 25) + 1
      }));
    }
  };

  const generateValueData = (type: string) => {
    if (type === "Day") {
      return Array.from({ length: 30 }, (_, i) => ({
        name: `Day ${i + 1}`,
        invoice: Math.floor(Math.random() * 25) + 1,
        payment: Math.floor(Math.random() * 25) + 1
      }));
    } else if (type === "Week") {
      return Array.from({ length: 4 }, (_, i) => ({
        name: `Week ${i + 1}`,
        invoice: Math.floor(Math.random() * 25) + 1,
        payment: Math.floor(Math.random() * 25) + 1
      }));
    } else {
      return Month.map((month, i) => ({
        name: month,
        invoice: Math.floor(Math.random() * 25) + 1,
        payment: Math.floor(Math.random() * 25) + 1
      }));
    }
  };

  const CustomBar = (props) => {
    const { x, y, width, height, name } = props;
    const isHovered = hoveredBar === name;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={isHovered ? 'url(#barHoverGradient)' : 'url(#barGradient)'} // Changed fill on hover
          stroke="#D8C5C2" // Border color
          strokeWidth={0.7} // Border thickness
          rx="2" // Border radius
          ry="2" // Border radius
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      setHoveredBar(label);
      setInvoicePayload(payload[0].value)
      return (
        <div className="flex flex-col p-2 space-y-1 text-xs custom-tooltip font-lexend bg-[#22306D] text-white rounded font-medium shadow-md">
          <p className="label">{`${label}`}</p>
          <p className="desc">{`Invoices: ${payload[0].value}`}</p>
        </div>
      );
    }
    setHoveredBar(null);
    return null;
  };

  const CustomLineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const invoice = payload.find((entry) => entry.dataKey === "invoice");
      const payment = payload.find((entry) => entry.dataKey === "payment");

      return (
        <div className="flex flex-col p-2 space-y-1 text-xs font-medium bg-white border rounded shadow-md custom-tooltip font-lexend">
          <p className="label">{`${label}`}</p>
          {invoice && (
            <p className="desc" style={{ color: '#4561DB' }}>{`Invoices: ${invoice.value}`}</p>
          )}
          {payment && (
            <p className="desc" style={{ color: '#D6236A' }}>{`Payments: ${payment.value}`}</p>
          )}
        </div>
      );
    }

    return null;
  };

  useEffect(() => {
    setInvoiceChartData(generateInvoiceData(invoiceChartState));
  }, [invoiceChartState]);

  useEffect(() => {
    setValueChartData(generateValueData(valueChartState));
  }, [valueChartState]);
  return (
    <div className="flex-col space-y-8 pb-14">
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
                ${[1, 2, 3].includes(card.id) &&
              "bg-custom-blue-200 text-primary-color"
              }
                ${card.id === 4 && "bg-color-light-green text-color-dark-green"}
                ${[5, 6].includes(card.id) &&
              "bg-color-light-yellow text-color-bright-orange"
              }
              `}
            descriptionStyle={"text-[10px] lg:text-xs text-color-text-two font-lexend"}
            nameStyle={"text-xs lg:text-sm font-medium lg:font-semibold text-color-text-one font-lexend"}
            currencyStyle={"text-sm lg:text-2xl text-color-bright-green"}
            valueStyle={"text-lg lg:text-3xl"}
          />
        ))}
      </div>
      <hr className="border-0.5 mb-8 border-custom-grey-100" />
      <div className="flex-col border-0.6 w-full border-custom-color-one shadow rounded">
        <div className="flex items-center justify-between px-4 py-2 bg-color-light-green ">
          <p className="text-base font-bold font-lexend text-color-text-one">
            Invoice Generated
          </p>
          <div className="flex items-center gap-3 text-xs font-lexend">
            <span
              className={`cursor-pointer ${invoiceChartState === "Day"
                ? "text-color-dark-red font-bold"
                : "text-color-text-two"
                }`}
              onClick={() => setInvoiceChartState("Day")}
            >
              Day
            </span>
            <span
              className={`cursor-pointer ${invoiceChartState === "Week"
                ? "text-color-dark-red font-bold"
                : "text-color-text-two"
                }`}
              onClick={() => setInvoiceChartState("Week")}
            >
              Week
            </span>
            <span
              className={`cursor-pointer ${invoiceChartState === "Month"
                ? "text-color-dark-red font-bold"
                : "text-color-text-two"
                }`}
              onClick={() => setInvoiceChartState("Month")}
            >
              Month
            </span>
            <select
              className="p-2 overflow-y-auto font-medium leading-tight border rounded outline-none text-color-text-two font-lexend bg-inherit border-divider-grey overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white"
              onChange={handleMonthChange}
              value={selectedMonth}
            >
              {Month.map((month, index) => (
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
          <span className="text-color-text-black">{invoicePayload}</span>
        </p>
        <div className="flex-col p-4 bg-very-light-grey">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={invoiceChartData}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity={1} />
                  <stop offset="63%" stopColor="#D8C5C2" stopOpacity={0.63} />
                  <stop offset="100%" stopColor="#D8C5C2" stopOpacity={1} />
                </linearGradient>
                {/* Added hover gradient */}
                <linearGradient id="barHoverGradient" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#F76FA5" stopOpacity={1} />
                  <stop offset="19%" stopColor="#D12B6D" stopOpacity={1} />
                  <stop offset="81%" stopColor="#D5296D" stopOpacity={1} />
                  <stop offset="100%" stopColor="#FFBDD7" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontFamily: 'Lexend', fontSize: 12, fontWeight: 500 }}
              />
              <YAxis
                domain={[0, 25]}
                ticks={[0, 5, 10, 15, 20, 25]}
                tick={{ fontFamily: 'Lexend', fontSize: 12, fontWeight: 500 }}
                label={{ value: 'Invoices', angle: -90, position: 'insideLeft', fontFamily: 'Lexend', fontSize: 12, fontWeight: 'bold' }}
              />
              <Tooltip
                cursor={false}
                active={true}
                content={<CustomTooltip active payload label />}
                wrapperStyle={{ fontFamily: 'Lexend', fontSize: 12 }}
                contentStyle={{ fontFamily: 'Lexend', fontSize: 12 }}
              />
              <Bar dataKey="value" name={invoiceChartState} shape={<CustomBar />} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex-col border-0.6 w-full border-custom-color-one shadow rounded">
        <div className="flex items-center justify-between px-4 py-2 bg-color-light-yellow">
          <p className="text-base font-bold font-lexend text-color-text-one">
            Value Generated
          </p>
          <div className="flex items-center gap-3 text-xs font-lexend">
            <span
              className={`cursor-pointer ${valueChartState === "Day"
                ? "text-color-dark-red font-bold"
                : "text-color-text-two"
                }`}
              onClick={() => setValueChartState("Day")}
            >
              Day
            </span>
            <span
              className={`cursor-pointer ${valueChartState === "Week"
                ? "text-color-dark-red font-bold"
                : "text-color-text-two"
                }`}
              onClick={() => setValueChartState("Week")}
            >
              Week
            </span>
            <span
              className={`cursor-pointer ${valueChartState === "Month"
                ? "text-color-dark-red font-bold"
                : "text-color-text-two"
                }`}
              onClick={() => setValueChartState("Month")}
            >
              Month
            </span>
            <select
              className="p-2 overflow-y-auto font-medium leading-tight border rounded outline-none text-color-text-two font-lexend bg-inherit border-divider-grey overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white"
              onChange={handleMonthChange}
              value={selectedMonth}
            >
              {Month.map((month, index) => (
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
        <div className="flex items-center justify-start gap-2 px-4 py-2 text-xs border-b bg-very-light-grey border-custom-color-one font-mulish text-color-text-one">
          <div className="flex items-center gap-1">
            <span className="w-[13px] h-[13px] bg-primary-color"></span>
            <span>Invoices Generated</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-[13px] h-[13px] bg-color-dark-red"></span>
            <span>Payments Received</span>
          </div>
        </div>
        <div className="flex-col p-4 bg-very-light-grey">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={valueChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontFamily: 'Lexend', fontSize: 12, fontWeight: 500 }}
              />
              <YAxis
                domain={[0, 25]}
                ticks={[0, 5, 10, 15, 20, 25]}
                tick={{ fontFamily: 'Lexend', fontSize: 12, fontWeight: 500 }}
                label={{ value: 'Value', angle: -90, position: 'insideLeft', fontFamily: 'Lexend', fontSize: 12, fontWeight: 'bold' }}
              />
              <Tooltip
                content={<CustomLineTooltip active label payload />}
                wrapperStyle={{ fontFamily: 'Lexend', fontSize: 12 }}
                contentStyle={{ fontFamily: 'Lexend', fontSize: 12 }}
              />
              <Line type="monotone" dataKey="invoice" stroke="#4561DB" fill="#4561DB" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="payment" stroke="#D6236A" fill="#D6236A" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Statistics
