import { RiShieldStarFill } from "react-icons/ri";
import { IoAlertCircleSharp } from "react-icons/io5";
import { TableData } from "../Index";

export default function CardData() {
  return [
    {
      id: 1,
      icon: <RiShieldStarFill />,
      description: "Registered Properties in the last",
      name: "30 Days",
      value: TableData.cardInformation.totalRegisteredPropertiesLast30Days,
    },
    {
      id: 2,
      icon: <IoAlertCircleSharp />,
      description: "Ungenerated",
      name: "Properties",
      value: TableData.cardInformation.totalUngeneratedProperties,
    },
    {
      id: 3,
      icon: <IoAlertCircleSharp />,
      description: "Properties without",
      name: "Rating",
      value: TableData.cardInformation.propertiesWithoutRatingDistrict,
    },
  ];
}
