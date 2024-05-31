import React from "react";
import { RiShieldStarFill } from "react-icons/ri";
import { IoAlertCircleSharp } from "react-icons/io5";
import { userData } from "../Index";

interface CardItem {
  id: number;
  icon: React.ReactNode;
  description: string;
  name: string;
  value: number | undefined;
}

export function CardData(): CardItem[] {
  const { statistics } = userData();

  return [
    {
      id: 1,
      icon: <RiShieldStarFill />,
      description: "Value of Generated",
      name: "Demand Notices",
      value: statistics?.total_demand_notices_amount || 0,
    },
    {
      id: 2,
      icon: <RiShieldStarFill />,
      description: "Total Number of Registered",
      name: "Properties",
      value: statistics?.total_properties || 0,
    },
    {
      id: 3,
      icon: <RiShieldStarFill />,
      description: "Total Number of Generated ",
      name: "Demand Notices",
      value: statistics?.total_demand_notices || 0,
    },
    {
      id: 4,
      icon: <RiShieldStarFill />,
      description: "Total Number of Paid",
      name: "Demand Notices",
      value: statistics?.total_paid_demand_notices || 0,
    },
    {
      id: 5,
      icon: <IoAlertCircleSharp />,
      description: "Total Number of Pending",
      name: "Demand Notices",
      value: statistics?.total_pending_demand_notices || 0,
    },
    // {
    //   id: 6,
    //   icon: <IoAlertCircleSharp />,
    //   description: "Expiring",
    //   name: "Demand Notices",
    //   value: 0,
    // },
  ];
}
