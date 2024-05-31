import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
interface DataContextType {
  isOnline: boolean; // New property for online status
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(
    typeof window !== "undefined" ? window.navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <DataContext.Provider
      value={{
        isOnline,
      }}
    >
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
