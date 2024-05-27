import { staticInformation } from "../../Data/appData"

interface Option {
  id: number;
  name: string;
}

interface FieldData {
  id: number;
  inputName: string;
  placeholder: string;
  inputType: string;
  options?: Option[];
  required: boolean;
}

interface Section {
  id: number;
  name: string;
  fieldData: FieldData[];
}

interface Data {
  properties: {
    propertyId: string[];
  };
  section: Section[];
}

const data: Data = {
  properties: {
    propertyId: [
      "13012894",
      "13073105",
      "13948573",
      "13275981",
      "13095642",
      "13785429",
      "13425736",
      "13246857",
    ],
  },
  section: [
    {
      id: 1,
      name: "Details",
      fieldData: [
        {
          id: 1,
          inputName: "propertyIdentificationNumber",
          placeholder: "Property Identification Number",
          inputType: "text",
          required: true,
        },
        {
          id: 2,
          inputName: "cadestralZone",
          placeholder: "Cadestral Zone",
          inputType: "select",
          options: staticInformation.cadestralZones.map((zone, index) => ({
            id: index + 1,
            name: zone
          })),
          required: true,
        },
        {
          id: 3,
          inputName: "assetNumber",
          placeholder: "Asset Number",
          inputType: "text",
          required: true,
        },
        {
          id: 4,
          inputName: "streetName",
          placeholder: "Street Name",
          inputType: "text",
          required: true,
        },
        {
          id: 5,
          inputName: "propertyAddress",
          placeholder: "Property Address",
          inputType: "text",
          required: true,
        },
        {
          id: 6,
          inputName: "ratingDistrict",
          placeholder: "Rating District",
          inputType: "select",
          options: staticInformation.cadestralZones.map((zone, index) => ({
            id: index + 1,
            name: zone
          })),
          required: true,
        },
        {
          id: 7,
          inputName: "category",
          placeholder: "Category",
          inputType: "select",
          options: [
            { id: 1, name: "Category One" },
            { id: 2, name: "Category Two" },
            { id: 3, name: "Category Three" },
          ],
          required: true,
        },
        {
          id: 8,
          inputName: "propertyType",
          placeholder: "Property Type",
          inputType: "select",
          options: [
            { id: 1, name: "Property Type One" },
            { id: 2, name: "Property Type Two" },
            { id: 3, name: "Property Type Three" },
          ],
          required: true,
        },
        {
          id: 9,
          inputName: "group",
          placeholder: "Group",
          inputType: "select",
          options: [
            { id: 1, name: "AMAC 1" },
            { id: 2, name: "AMAC 2" },
            { id: 3, name: "AMAC 3" },
          ],
          required: false,
        },
        {
          id: 10,
          inputName: "propertyUse",
          placeholder: "Property Use",
          inputType: "select",
          options: [
            { id: 1, name: "Residential" },
            { id: 2, name: "Commercial" },
            { id: 3, name: "School" },
          ],
          required: true,
        },
        // {
        //   id: 10,
        //   parentKey: "1",
        //   inputName: "occupationStatus",
        //   placeholder: "Occupation Status",
        //   inputType: "select",
        //   options: [
        //     { id: 1, name: "Occupation Status One" },
        //     { id: 2, name: "Occupation Status Two" },
        //     { id: 3, name: "Occupation Status Three" },
        //   ],
        //   required: false,
        // },
      ],
    },
    {
      id: 2,
      name: "Valuation",
      fieldData: [
        {
          id: 1,
          inputName: "annualValue",
          placeholder: "Annual Value",
          inputType: "text",
          required: true,
        },
        {
          id: 2,
          inputName: "ratePayable",
          placeholder: "Rate Payable",
          inputType: "text",
          required: true,
        },
        {
          id: 3,
          inputName: "arrears",
          placeholder: "Arrears",
          inputType: "text",
          required: false,
        },
        {
          id: 4,
          inputName: "penalty",
          placeholder: "Penalty",
          inputType: "text",
          required: false,
        },
        {
          id: 5,
          inputName: "grandTotal",
          placeholder: "Grand Total",
          inputType: "text",
          required: true,
        },
      ],
    },
    {
      id: 3,
      name: "Occupant Details",
      fieldData: [
        {
          id: 1,
          inputName: "occupantsFirstName",
          placeholder: "Occupants First Name",
          inputType: "text",
          required: true,
        },
        {
          id: 2,
          inputName: "occupantsLastName",
          placeholder: "Occupants Last Name",
          inputType: "text",
          required: true,
        },
        {
          id: 3,
          inputName: "occupantsPhoneNumber",
          placeholder: "Occupants Phone Number",
          inputType: "text",
          required: false,
        },
        {
          id: 4,
          inputName: "occupantsEmail",
          placeholder: "Occupants Email",
          inputType: "email",
          required: false,
        },
        {
          id: 5,
          inputName: "occupantsMaritalStatus",
          placeholder: "Occupants Marital Status",
          inputType: "text",
          required: false,
        },
      ],
    },
  ],
};

export { data };
