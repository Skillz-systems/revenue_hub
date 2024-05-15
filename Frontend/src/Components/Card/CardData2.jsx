import { RiShieldStarFill } from "react-icons/ri";
import { IoAlertCircleSharp } from "react-icons/io5";

export default function CardData() {
  return [
    {
      id: 1,
      icon: <RiShieldStarFill />,
      description: "Registered Properties in the last",
      name: "30 Days",
      value: 47,
    },
    {
      id: 2,
      icon: <IoAlertCircleSharp />,
      description: "Ungenerated",
      name: "Properties",
      value: 174,
    },
    {
      id: 3,
      icon: <IoAlertCircleSharp />,
      description: "Properties without",
      name: "Rating",
      value: 16,
    },
  ];
}
