import React from "react";
import { RiShieldStarFill } from "react-icons/ri";
import { IoAlertCircleSharp } from "react-icons/io5";
import { useAppData } from "../../Context/DataContext";

interface CardItem {
  id: number;
  icon: React.ReactNode;
  description: string;
  name: string;
  value: number;
}

export function CardData(): CardItem[] {
  const { cardInformation } = useAppData();

  return [
    {
      id: 1,
      icon: <RiShieldStarFill />,
      description: "Value of Generated",
      name: "Demand Notices",
      value: cardInformation.overallDemandNoticeValue,
    },
    {
      id: 2,
      icon: <RiShieldStarFill />,
      description: "Total Number of Registered",
      name: "Properties",
      value: cardInformation.totalRegisteredProperties,
    },
    {
      id: 3,
      icon: <RiShieldStarFill />,
      description: "Total Number of Generated ",
      name: "Demand Notices",
      value: cardInformation.totalGeneratedDemandNotices,
    },
    {
      id: 4,
      icon: <RiShieldStarFill />,
      description: "Total Number of Paid",
      name: "Demand Notices",
      value: cardInformation.totalPaidDemandNotices,
    },
    {
      id: 5,
      icon: <IoAlertCircleSharp />,
      description: "Total Number of Pending",
      name: "Demand Notices",
      value: cardInformation.totalPendingDemandNotices,
    },
    {
      id: 6,
      icon: <IoAlertCircleSharp />,
      description: "Expiring",
      name: "Demand Notices",
      value: cardInformation.expiringDemandNotices,
    },
  ];
}

export function CardData2(): CardItem[] {
  const { cardInformation } = useAppData();

  return [
    {
      id: 1,
      icon: <RiShieldStarFill />,
      description: "Registered Properties in the last",
      name: "30 Days",
      value: cardInformation.totalRegisteredPropertiesLast30Days,
    },
    {
      id: 2,
      icon: <IoAlertCircleSharp />,
      description: "Ungenerated",
      name: "Properties",
      value: cardInformation.totalUngeneratedProperties,
    },
    {
      id: 3,
      icon: <IoAlertCircleSharp />,
      description: "Properties without",
      name: "Rating",
      value: cardInformation.propertiesWithoutRatingDistrict,
    },
  ];
}
