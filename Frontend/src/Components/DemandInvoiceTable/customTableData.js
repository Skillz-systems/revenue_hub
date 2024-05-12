let zones = [
  "Apo",
  "Asokoro",
  "Bwari",
  "Central Area",
  "Chika",
  "Dakibiya",
  "Dakwo",
  "Dei-Dei",
  "Duboyi",
  "Durumi",
  "Dutse",
  "Gaduwa",
  "Galadimawa",
  "Garki",
  "Gudu",
  "Guzape",
  "Gwagwa",
  "Gwagwalada",
  "Gwarinpa",
  "Idu",
  "Jabi",
  "Jahi",
  "Jikwoyi",
  "Kabusa",
  "Kado",
  "Kajini",
  "Karsana",
  "Karu",
  "Katampe",
  "Kaura",
  "Keffi",
  "Kubwa",
  "Kuchigworo",
  "Kukwaba",
  "Lokogoma",
  "Lugbe",
  "Mabushi",
  "Maitama",
  "Mbora",
  "Mpape",
  "Nyanya",
  "Pyakasa",
  "Utako",
  "Waru-Pouma",
  "Wumba",
  "Wuse",
  "Wuye",
  "Zuba",
];

const propertyUse = ["Commercial", "Residential", "School"];

export { zones, propertyUse }

const africanFirstNames = [
  "Abimbola",
  "Chinwe",
  "Fatou",
  "Kwame",
  "Lamidi",
  "Ngozi",
  "Oluwafemi",
  "Sadio",
  "Thabo",
  "Yaa",
  "Naledi",
  "Adeola",
  "Aisha",
  "Akinyi",
  "Lumumba",
  "Nkosazana",
  "Mandla",
  "Patience",
  "Sekou",
  "Aminata",
];

const africanLastNames = [
  "Abdul",
  "Diop",
  "Gebre",
  "Kante",
  "Mandela",
  "Mbeki",
  "Mugabe",
  "Nkrumah",
  "Obasanjo",
  "Zuma",
  "Nkosi",
  "Kenku",
  "Braima",
  "Diallo",
  "Nyongo",
  "Girum",
  "Dlamini",
  "Mugisha",
  "Touré",
  "Ouedraogo",
];

const generateRandomPropertyRecord = () => {
  return {
    id: Math.floor(1 + Math.random() * 1000),
    pin: `13${Math.floor(10000000 + Math.random() * 900000000)}`,
    propertyUse: ["Commercial", "Residential", "School"][Math.floor(Math.random() * 3)],
    paymentStatus: ["Paid", "Unpaid", "Ungenerated"][Math.floor(Math.random() * 3)],
    address: `House ${Math.floor(1 + Math.random() * 100)}, Street, Abuja`,
    cadestralZone: zones[Math.floor(Math.random() * zones.length)],
    ratePayable: Math.floor(1000 + Math.random() * 100000),
    amacZones: ["Amac 1", "Amac 2", "Amac 3"][Math.floor(Math.random() * 3)],
  };
};
const propertyRecords = Array.from({ length: 500 }, generateRandomPropertyRecord);

const generateRandomDemandRecord = () => {
  return {
    id: Math.floor(1 + Math.random() * 1000),
    pin: `13${Math.floor(10000000 + Math.random() * 900000000)}`,
    address: `House ${Math.floor(1 + Math.random() * 100)}, Street, Abuja`,
    date: `12/${Math.floor(1 + Math.random() * 12)}/2024`,
    propertyUse: ["Commercial", "Residential", "School"][Math.floor(Math.random() * 3)],
    cadestralZone: zones[Math.floor(Math.random() * zones.length)],
    ratePayable: Math.floor(1000 + Math.random() * 100000),
    paymentStatus: ["Paid", "Unpaid", "Expired"][Math.floor(Math.random() * 3)],
  };
};
const demandRecords = Array.from({ length: 50 }, generateRandomDemandRecord);

const generateRandomTransactionRecord = () => {
  return {
    id: Math.floor(1 + Math.random() * 1000),
    demandNoticeNumber: `156${Math.floor(10000000 + Math.random() * 900000000)}`,
    pin: `13${Math.floor(10000000 + Math.random() * 900000000)}`,
    address: `House 1, Street ${Math.floor(
      1 + Math.random() * 100
    )}, Abuja`,
    type: ["Mobile Transfer", "Bank Transfer",][
      Math.floor(Math.random() * 2)
    ],
    ratePayable: Math.floor(1000 + Math.random() * 100000),
    date: `12/${Math.floor(1 + Math.random() * 12)}/2024`,
  }
}
const transactionRecords = Array.from({ length: 15 }, generateRandomTransactionRecord);

const generateRandomStaffRecord = () => {
  return {
    id: Math.floor(1 + Math.random() * 1000),
    staffId: `13${Math.floor(100000000 + Math.random() * 900000000)}`,
    fullName: `${africanFirstNames[Math.floor(Math.random() * africanFirstNames.length)]} ${africanLastNames[Math.floor(Math.random() * africanLastNames.length)]}`,
    email: `${africanFirstNames[Math.floor(Math.random() * africanFirstNames.length)]}${Math.floor(
      1 + Math.random() * 100
    )}@gmail.com`,
    phoneNumber: `080${Math.floor(100000 + Math.random() * 9999999)}`,
    type: ["Manager", "Officer",][
      Math.floor(Math.random() * 2)
    ],
  }
}
const staffRecords = Array.from({ length: 30 }, generateRandomStaffRecord);

const data = {
  properties: {
    records: propertyRecords,
  },
  demandNotice: {
    menu: [
      {
        id: 1,
        name: "All Demand Notices",
      },
      {
        id: 2,
        name: "Paid Demand Notices",
      },
      {
        id: 3,
        name: "Unpaid Demand Notices",
      },
      {
        id: 4,
        name: "Expired Demand Notices",
      },
    ],
    columns: [
      { id: 1, name: "PIN" },
      { id: 2, name: "ADDRESS" },
      { id: 3, name: "DATE" },
      { id: 4, name: "PROPERTY USE" },
      { id: 5, name: "CADESTRAL ZONE" },
      { id: 6, name: "RATE PAYABLE" },
      { id: 7, name: "PAYMENT STATUS" },
      { id: 8, name: "ACTIONS" },
    ],
    records: demandRecords,
  },
  statistics: {
    invoicesGenerated: [],
    valuegenerated: [],
  },
  transactions: {
    menu: [
      {
        id: 1,
        name: "All Transactions",
      },
      {
        id: 2,
        name: "Manually confirmed Transactions",
      },
    ],
    columns: [
      { id: 1, name: "DEMAND NOTICE NUMBER" },
      { id: 2, name: "PIN" },
      { id: 3, name: "ADDRESS" },
      { id: 4, name: "TYPE" },
      { id: 5, name: "RATE PAYABLE" },
      { id: 6, name: "DATE PAID" },
      { id: 7, name: "ACTIONS" },
    ],
    records: transactionRecords,
  },
  staff: {
    menu: [
      {
        id: 1,
        name: "All Staff",
      },
      {
        id: 2,
        name: "All Managers",
      },
      {
        id: 3,
        name: "All Officers",
      },
    ],
    columns: [
      { id: 1, name: "STAFF ID" },
      { id: 2, name: "FULL NAME" },
      { id: 3, name: "EMAIL" },
      { id: 4, name: "PHONE NUMBER" },
      { id: 5, name: "TYPE" },
      { id: 6, name: "ACTIONS" },
    ],
    records: staffRecords,
  },
};

export { data };
