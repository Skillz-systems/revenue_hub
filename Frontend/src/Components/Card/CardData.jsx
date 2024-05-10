import { RiShieldStarFill } from "react-icons/ri";
import { IoAlertCircleSharp } from "react-icons/io5";

export default function CardData() {
  return [
    {
      id: 1,
      icon: <RiShieldStarFill />,
      description: "Value of Generated",
      name: "Demand Notices",
      value: 4000444,
    },
    {
      id: 2,
      icon: <RiShieldStarFill />,
      description: "Total Number of Registered",
      name: "Properties",
      value: 570,
    },
    {
      id: 3,
      icon: <RiShieldStarFill />,
      description: "Total Number of Generated ",
      name: "Demand Notices",
      value: 420,
    },
    {
      id: 4,
      icon: <RiShieldStarFill />,
      description: "Total Number of Paid",
      name: "Demand Notices",
      value: 174,
    },
    {
      id: 5,
      icon: <IoAlertCircleSharp />,
      description: "Total Number of Pending",
      name: "Demand Notices",
      value: 246,
    },
    {
      id: 6,
      icon: <IoAlertCircleSharp />,
      description: "Expiring",
      name: "Demand Notices",
      value: 42,
    },
  ];
}
