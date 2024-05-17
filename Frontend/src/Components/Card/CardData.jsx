import { RiShieldStarFill } from "react-icons/ri";
import { IoAlertCircleSharp } from "react-icons/io5";
import { TableData } from "../Index";

export default function CardData() {
  return [
    {
      id: 1,
      icon: <RiShieldStarFill />,
      description: "Value of Generated",
      name: "Demand Notices",
      value: TableData.cardInformation.overallDemandNoticeValue,
    },
    {
      id: 2,
      icon: <RiShieldStarFill />,
      description: "Total Number of Registered",
      name: "Properties",
      value: TableData.cardInformation.totalRegisteredProperties,
    },
    {
      id: 3,
      icon: <RiShieldStarFill />,
      description: "Total Number of Generated ",
      name: "Demand Notices",
      value: TableData.cardInformation.totalGeneratedDemandNotices,
    },
    {
      id: 4,
      icon: <RiShieldStarFill />,
      description: "Total Number of Paid",
      name: "Demand Notices",
      value: TableData.cardInformation.totalPaidDemandNotices,
    },
    {
      id: 5,
      icon: <IoAlertCircleSharp />,
      description: "Total Number of Pending",
      name: "Demand Notices",
      value: TableData.cardInformation.totalPendingDemandNotices,
    },
    {
      id: 6,
      icon: <IoAlertCircleSharp />,
      description: "Expiring",
      name: "Demand Notices",
      value: TableData.cardInformation.expiringDemandNotices,
    },
  ];
}
