import { staticInformation } from "../../Data/appData"

interface InputOption {
  id: number;
  name: string;
}

interface InputData {
  id: number;
  inputName: string;
  placeholder: string;
  inputType: string;
  options?: InputOption[];
  required: boolean;
}

const data: InputData[] = [
  {
    id: 1,
    inputName: "staffFirstName",
    placeholder: "Staff First Name",
    inputType: "text",
    required: true,
  },
  {
    id: 2,
    inputName: "staffLastName",
    placeholder: "Staff Last Name",
    inputType: "text",
    required: true,
  },
  {
    id: 3,
    inputName: "staffMiddleName",
    placeholder: "Staff Middle Name",
    inputType: "text",
    required: false,
  },
  {
    id: 4,
    inputName: "staffEmail",
    placeholder: "Staff Email",
    inputType: "text",
    required: true,
  },
  {
    id: 5,
    inputName: "staffPhoneNumber",
    placeholder: "Staff Phone Number",
    inputType: "text",
    required: true,
  },
  {
    id: 6,
    inputName: "staffDesignation",
    placeholder: "Staff Designation",
    inputType: "select",
    options: [
      { id: 1, name: "Manager" },
      { id: 2, name: "Admin" },
      { id: 3, name: "Officer" },
      { id: 4, name: "Enforcer" },
    ],
    required: true,
  },
  {
    id: 7,
    inputName: "staffZone",
    placeholder: "Staff Zone",
    inputType: "select",
    options: staticInformation.cadestralZones.map((zone, index) => ({
      id: index + 1,
      name: zone,
    })),
    required: true,
  },
];

export { data };
