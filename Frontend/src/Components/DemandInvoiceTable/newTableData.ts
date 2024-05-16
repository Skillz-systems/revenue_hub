const cadestralZones = [
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

const propertyUse = ["Commercial", "Residential", "School"];
const propertyType = ["Consolidated", "Unconsolidated"];
const occupationStatus = ["Occupied", "Unoccupied"];
const group = ["Amac 1", "Amac 2", "Amac 3"];
const paymentStatus = ["Paid", "Unpaid", "Expired", "Ungenerated"];
const maritalStatus = ["Single", "Married", "Divorced", "Separated", "Widowed", "Domestic Partnership"];
const paymentType = ["Mobile Transfer", "Bank Transfer",]

const randomDay = Math.floor(1 + Math.random() * 31);
const randomMonth = Math.floor(1 + Math.random() * 12);
const randomYear = Math.floor(2010 + Math.random() * (2024 - 2010 + 1));
const currentDate: any = new Date();
const dueDate: any = new Date(randomYear, randomMonth - 1, randomDay);

const generateRandomDate = (Start, End) => {
    const startYear = Start;
    const endYear = End;

    // Generate a random year between startYear and endYear (inclusive)
    const randomYear = Math.floor(startYear + Math.random() * (endYear - startYear + 1));

    // Generate random month (1-12) and day (1-31)
    const randomMonth = Math.floor(1 + Math.random() * 12);
    const randomDay = Math.floor(1 + Math.random() * 31);

    // Format the date as "DD-MM-YYYY"
    const formattedDate = `${randomDay.toString().padStart(2, '0')}/${randomMonth.toString().padStart(2, '0')}/${randomYear}`;

    return formattedDate;
};

// Define types for the exported arrays
type PropertyInformationType = PropertyRecord[];
type DemandNoticeInformationType = DemandNoticeRecord[];
type TransactionInformationType = TransactionRecord[];
type StaffInformationType = StaffRecord[];

interface PropertyRecord {
    id: number;
    dateRegistered: string;
    annualValue: string;
    ratePayable: number;
    paymentStatus: string;
    assetNumber: string;
    personalIdentificationNumber: string;
    propertyAddress: string;
    category: string;
    propertyUse: string;
    propertyType: string;
    cadestralZone: string;
    ratingDistrict: string;
    group: string;
    occupationStatus: string;
    occupantInfo: {
        id: number;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        email: string;
        maritalStatus: string;
    };
}

const generatePropertyRecord = (): PropertyRecord => {
    return {
        id: Math.floor(1 + Math.random() * 1000),
        dateRegistered: generateRandomDate(2010, 2024),
        annualValue: `${Math.floor(Math.random() * 10000000) + 1}.00`,
        ratePayable: Math.floor(1000 + Math.random() * 10000000),
        paymentStatus: paymentStatus[Math.floor(Math.random() * paymentStatus.length)],
        assetNumber: `209${Math.floor(10000000 + Math.random() * 900000000)}`,
        personalIdentificationNumber: `13${Math.floor(10000000 + Math.random() * 900000000)}`,
        propertyAddress: `No. ${Math.floor(1 + Math.random() * 150)}, ${africanFirstNames[Math.floor(Math.random() * africanFirstNames.length)]} Street, ${cadestralZones[Math.floor(Math.random() * cadestralZones.length)]}, Abuja`,
        category: propertyUse[Math.floor(Math.random() * propertyType.length)],
        propertyUse: propertyUse[Math.floor(Math.random() * propertyType.length)],
        propertyType: propertyType[Math.floor(Math.random() * propertyType.length)],
        cadestralZone: cadestralZones[Math.floor(Math.random() * cadestralZones.length)],
        ratingDistrict: cadestralZones[Math.floor(Math.random() * cadestralZones.length)],
        group: group[Math.floor(Math.random() * group.length)],
        occupationStatus: occupationStatus[Math.floor(Math.random() * occupationStatus.length)],
        occupantInfo: {
            id: Math.floor(1 + Math.random() * 1000),
            firstName: africanFirstNames[Math.floor(Math.random() * africanFirstNames.length)],
            lastName: africanLastNames[Math.floor(Math.random() * africanLastNames.length)],
            phoneNumber: `080${Math.floor(100000 + Math.random() * 9999999)}`,
            email: `${africanFirstNames[Math.floor(Math.random() * africanFirstNames.length)]}${Math.floor(1 + Math.random() * 100)}@gmail.com`,
            maritalStatus: maritalStatus[Math.floor(Math.random() * maritalStatus.length)]
        },
    };
}
const propertyInformation: PropertyInformationType = Array.from({ length: 500 }, generatePropertyRecord);
const propertiesWithDemandNotice: PropertyInformationType = Array.from({ length: 100 }, generatePropertyRecord);
const propertiesWithPaidPaymentStatus: PropertyInformationType = propertiesWithDemandNotice.filter(property => property.paymentStatus === "Paid");

const thirtyDaysAgo: Date = new Date(currentDate);
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const propertiesRegisteredLast30Days: PropertyRecord[] = propertyInformation.filter(property => {
    const propertyDateRegistered: Date = new Date(property.dateRegistered);
    return propertyDateRegistered >= thirtyDaysAgo && propertyDateRegistered <= currentDate;
});

interface DemandNoticeRecord {
    id: number;
    demandNoticeNumber: string;
    propertyInformation: PropertyRecord;
    arrears: number;
    penalty: number;
    dateCreated: string;
    dueDate: number;
    daysToNextInvoice: number;
}

const generateDemandNoticeRecord = (property: PropertyRecord): DemandNoticeRecord => {
    // Generate a random date for dateCreated that is greater than dateRegistered
    const startDate = new Date(property.dateRegistered);
    const endDate = new Date(); // Current date
    const randomDateCreated = generateRandomDate(startDate, endDate);

    return {
        id: Math.floor(1 + Math.random() * 1000),
        demandNoticeNumber: `156${Math.floor(10000000 + Math.random() * 900000000)}`,
        propertyInformation: { ...property },
        arrears: Math.floor(1000 + Math.random() * 1000000),
        penalty: Math.floor(1000 + Math.random() * 100000),
        dateCreated: randomDateCreated,
        dueDate: dueDate.setDate(dueDate.getDate() + 365),
        daysToNextInvoice: Math.floor(dueDate - currentDate / (1000 * 60 * 60 * 24)),
    }
}
const filteredPropertiesWithDemandNotice = propertiesWithDemandNotice.filter(property => property.paymentStatus !== "Ungenerated");
const demandNoticeInformation: DemandNoticeInformationType = filteredPropertiesWithDemandNotice.map(generateDemandNoticeRecord);

const overallValueRecord = (demandNotice) => {
    const totalValue = (parseFloat(demandNotice.propertyInformation.annualValue) + demandNotice.propertyInformation.ratePayable + demandNotice.arrears) - demandNotice.penalty;
    return { grandTotal: totalValue };
};
const overallInformation = demandNoticeInformation.map(overallValueRecord);

interface TransactionRecord {
    id: number;
    transactionId: string;
    transactionType: string;
    transactionDate: string;
    transactionTime: string;
    propertyDetails: {
        personalIdentificationNumber: string;
        assetNumber: string;
        cadastralZone: string;
        address: string;
        ratingDistrict: string;
    };
    transactionAmount: number;
    transactionStatus: string;
}

const generateTransactionRecord = (property: PropertyRecord): TransactionRecord => {
    return {
        id: Math.floor(1 + Math.random() * 1000),
        transactionId: `304${Math.floor(10000000 + Math.random() * 900000000)}`,
        transactionType: paymentType[Math.floor(Math.random() * 2)],
        transactionDate: `${randomDay}/${randomMonth}/${randomYear}`,
        transactionTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        propertyDetails: {
            personalIdentificationNumber: property.personalIdentificationNumber,
            assetNumber: property.assetNumber,
            cadastralZone: property.cadestralZone,
            address: property.propertyAddress,
            ratingDistrict: property.ratingDistrict
        },
        transactionAmount: property.ratePayable,
        transactionStatus: "Successful",
    }
}
const transactionInformation: TransactionInformationType = propertiesWithPaidPaymentStatus.map(generateTransactionRecord);

interface StaffRecord {
    id: number;
    staffId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    type: string;
}

const generateStaffRecord = () => {
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
const staffInformation: StaffInformationType = Array.from({ length: 30 }, generateStaffRecord);

const cardInformation = {
    totalRegisteredProperties: propertyInformation.length,
    totalGeneratedDemandNotices: demandNoticeInformation.length,
    totalPaidDemandNotices: propertiesWithPaidPaymentStatus.length,
    totalPendingDemandNotices: demandNoticeInformation.filter(demandNotice => demandNotice.propertyInformation.paymentStatus === "Unpaid").length,
    expiringDemandNotices: demandNoticeInformation.filter(demandNotice => demandNotice.propertyInformation.paymentStatus === "Expired").length,
    totalRegisteredPropertiesLast30Days: propertiesRegisteredLast30Days.length,
    totalUngeneratedProperties: propertyInformation.filter(property => property.paymentStatus === "Ungenerated").length,
    propertiesWithoutRatingDistrict: propertyInformation.filter(property => !property.ratingDistrict || property.ratingDistrict.trim() === "").length || 0,
    overallDemandNoticeValue: overallInformation.reduce((totalValue, overallInfo) => { return totalValue + overallInfo.grandTotal; }, 0)
};

const staticInformation = {
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
    },
}
export { PropertyInformationType, DemandNoticeInformationType, TransactionInformationType, StaffInformationType };
const TableData = { staticInformation, propertyInformation, demandNoticeInformation, transactionInformation, staffInformation, cardInformation }

export { TableData }