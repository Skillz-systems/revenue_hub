import React, { createContext, useContext, ReactNode } from "react"
import {
    staticInformation,
    propertyInformation,
    demandNoticeInformation,
    transactionInformation,
    staffInformation,
    cardInformation,
    accountInformation,
    demandInvoiceData
} from "../Data/appData";
import {
    StaticInformation,
    PropertyInformationType,
    TransactionInformationType,
    StaffInformationType,
    CardInformation,
    StaffRecord,
    DemandInvoiceDataType
} from "../Data/types";

interface DataContextType {
    staticInformation: StaticInformation;
    propertyInformation: PropertyInformationType;
    demandNoticeInformation: PropertyInformationType;
    transactionInformation: TransactionInformationType;
    staffInformation: StaffInformationType;
    cardInformation: CardInformation;
    accountInformation: StaffRecord;
    demandInvoiceData: DemandInvoiceDataType,
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
    children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
    return (
        <DataContext.Provider value={{
            staticInformation,
            propertyInformation,
            demandNoticeInformation,
            transactionInformation,
            staffInformation,
            cardInformation,
            accountInformation,
            demandInvoiceData,
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useAppData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error("useAppData must be used within a DataProvider");
    }
    return context;
};