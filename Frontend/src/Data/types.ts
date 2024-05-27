export interface StaticInformation {
    cadestralZones: string[];
    propertyUse: string[];
    demandNotice: {
        menu: { id: number; name: string }[];
        columns: { id: number; name: string }[];
    };
    transactions: {
        menu: { id: number; name: string }[];
        columns: { id: number; name: string }[];
    };
    staff: {
        menu: { id: number; name: string }[];
        columns: { id: number; name: string }[];
    };
}

export interface PropertyRecord {
    id: number;
    dateRegistered: string;
    annualValue: number;
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
    occupantInfo: [{
        id: number;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        email: string;
        maritalStatus: string;
    }];
    demandInvoiceData: {
        id: number;
        demandNoticeNumber: string;
        arrears: number;
        penalty: number,
        dateCreated: any;
    }[];

}
export type PropertyInformationType = PropertyRecord[];

export interface TransactionRecord {
    id: number;
    transactionId: string;
    transactionType: string;
    transactionDate: string;
    transactionTime: string;
    propertyDetails: {
        demandNoticeNumber: string;
        personalIdentificationNumber: string;
        assetNumber: string;
        cadastralZone: string;
        address: string;
        ratingDistrict: string;
        ratePayable: number;
    };
    transactionAmount: number;
    transactionStatus: string;
}
export type TransactionInformationType = TransactionRecord[];

export interface StaffRecord {
    id: number;
    staffId: string;
    firstName: string;
    lastName: string;
    middleName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    designation: string;
    staffZone: string;
}
export type StaffInformationType = StaffRecord[];

export interface CardInformation {
    totalRegisteredProperties: number;
    totalGeneratedDemandNotices: number;
    totalPaidDemandNotices: number;
    totalPendingDemandNotices: number;
    expiringDemandNotices: number;
    totalRegisteredPropertiesLast30Days: number;
    totalUngeneratedProperties: number;
    propertiesWithoutRatingDistrict: number;
    overallDemandNoticeValue: number;
    transactionInformationValue: number;
}

export interface InvoiceProperty {
    label: string;
    value: string | number;
    isTotal?: boolean;
}

export interface DemandInvoiceDataType {
    Occupant: string;
    PropertyIdentificationNumber: string;
    QrCodePayment: string;
    propertyData: InvoiceProperty[];
    billInfoData: InvoiceProperty[];
    billDetailsData: InvoiceProperty[];
}
