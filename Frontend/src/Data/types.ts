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
    value?: string | number | undefined;
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

export interface StatisticsData {
    total_payments: number;
    total_demand_notices: number;
    total_paid_demand_notices: number;
    total_pending_demand_notices: number;
    total_demand_notices_amount: number;
    total_properties: number;
    total_users: number;
}


export interface DemandNotice {
    id: number;
    payments: {
        tx_ref: string;
        pin: string;
        actual_amount: number;
        charged_amount: number;
        app_fee: number;
        merchant_fee: number;
        status: string;
    }[];
    amount: string;
    arrears_amount: string;
    penalty: string;
    status: number;
    property: {
        pid: number;
        prop_addr: string;
        street_name: string;
        asset_no: string;
        demand_notice_status: string;
        cadastral_zone: string;
        prop_type: string;
        prop_use: string;
        rating_dist: string;
        annual_value: number;
        rate_payable: number;
        grand_total: number;
        category: string;
        group: string;
        active: string;
        created_at: string;
        updated_at: string;
    };
    date_created: string;
}

export interface TransactionsType {
    tx_ref: string;
    pin: string;
    demand_notice: {
        id: number;
        payments: {
            tx_ref: string;
            pin: string;
            actual_amount: number;
            charged_amount: number;
            app_fee: number;
            merchant_fee: number;
            status: string;
        }[];
        amount: string;
        arrears_amount: string;
        penalty: string;
        status: number;
        property: {
            pid: number;
            prop_addr: string;
            street_name: string;
            asset_no: string;
            cadastral_zone: string;
            prop_type: string;
            prop_use: string;
            rating_dist: string;
            annual_value: number;
            rate_payable: number;
            arrears: number;
            penalty: number;
            grand_total: number;
            category: string;
            group: string;
            active: string;
            created_at: string;
            updated_at: string;
        };
        date_created: string;
    };
    actual_amount: number;
    charged_amount: number;
    app_fee: number;
    merchant_fee: number;
    status: string;
}
