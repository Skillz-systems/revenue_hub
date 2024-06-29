import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HiOutlineDotsHorizontal, HiUsers } from 'react-icons/hi';
import AddNewStreetModal from './AddNewStreetModal';
import apiCall from '../../Api/apiCall';

interface TableData {
    id: number;
    name: string;
    zoneId?: number;


}

interface TabData {
    id: number;
    title: string;
    endpoint: string;
}

const tabData: TabData[] = [
    { id: 1, title: 'Rating District', endpoint: 'https://jsonplaceholder.typicode.com/users?_start=0&_limit=5' },
    { id: 2, title: 'Street', endpoint: 'https://jsonplaceholder.typicode.com/users?_start=5&_limit=5' },
    { id: 3, title: 'Cadastral Zone', endpoint: 'https://jsonplaceholder.typicode.com/users?_start=10&_limit=5' },
    { id: 4, title: 'Property Type', endpoint: 'https://jsonplaceholder.typicode.com/users?_start=15&_limit=5' },
    { id: 5, title: 'Property Use', endpoint: 'https://jsonplaceholder.typicode.com/users?_start=20&_limit=5' },
    { id: 6, title: 'Category', endpoint: 'https://jsonplaceholder.typicode.com/users?_start=25&_limit=5' },
    { id: 7, title: 'Office Zone', endpoint: 'https://jsonplaceholder.typicode.com/users?_start=25&_limit=5' },
    { id: 8, title: 'Particular Street', endpoint: 'https://jsonplaceholder.typicode.com/users?_start=25&_limit=5' },
];


/*const tabData: TabData[] = [
  { id: 1, title: 'Rating District', endpoint: '/street' },
  { id: 2, title: 'Street', endpoint: '/street' },
  { id: 3, title: 'Cadastral Zone', endpoint: '/street' },
  { id: 4, title: 'Property Type', endpoint: '/street' },
  { id: 5, title: 'Property Use', endpoint: '/street' },
  { id: 6, title: 'Category', endpoint: '/street' },
  { id: 7, title: 'Office Zone', endpoint: '/street' },
  { id: 8, title: 'Particular Street', endpoint: '/street' },
];
*/
const TabItem: React.FC<{ tabData: TabData }> = ({ tabData }) => {
    const [streets, setStreets] = useState([]);
    const [tableData, setTableData] = useState<TableData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [edit, setEdit] = useState<number | null>(null);
    const [isNewStreetModalOpen, setIsNewStreetModalOpen] = useState<boolean>(false);

    const showNewStreetModal = () => {
        setIsNewStreetModalOpen(true);
    };

    const hideNewStreetModal = () => {
        setIsNewStreetModalOpen(false);
    };
    const fetching = async () => {
        //setLoading(true);
        // setError(null);
        try {
            const response = await apiCall<any>({
                endpoint: tabData.endpoint,
                method: "get",

            })

            if (response.status === 200) {
               
                setStreets(response.data.data)
                //setTableData(response.data);
            }
        } catch (error) {
            
        } finally {
            //setLoading(false);
        }
    }
    useEffect(() => {
        fetching()
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(tabData.endpoint);
                setTableData(response.data);
            } catch (error) {
                setError('Error fetching data');
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [tabData.endpoint]);

    if (loading) return <p className="text-center text-blue-500">Loading data, please wait...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div>
            <div className="flex items-center justify-end mb-4 gap-2">
                <button
                    type="button"
                    className="flex items-center justify-between p-2 space-x-1 border rounded button-gradient-one border-custom-color-two shadow-custom-100"
                    style={{ width: "8%" }}
                    title="New District"
                    onClick={showNewStreetModal}
                >
                    <span className="text-sm text-white">
                        <HiUsers />
                    </span>
                    <span
                        className="font-medium text-left text-white ellipsis font-lexend"
                        style={{ fontSize: "0.6875rem" }}
                    >
                        New Street
                    </span>
                </button>
            </div>
            {isNewStreetModalOpen && (
                <AddNewStreetModal
                    isOpen={isNewStreetModalOpen}
                    hideModal={hideNewStreetModal}
                />
            )}
            <div className="overflow-x-auto">
                {/*<table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left border font-medium font-lexend text-gray-700 text-[10px]">ID</th>
              <th className="px-4 py-2 text-left border font-medium font-lexend text-gray-700 text-[10px]">Name</th>
              <th className="px-4 py-2 text-left border font-medium font-lexend text-gray-700 text-[10px]">Zone ID</th>
              <th className="px-4 py-2 text-left border font-medium font-lexend text-gray-700 text-[10px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-lexend text-gray-700 text-[15px]">{row.id}</td>
                <td className="px-4 py-2 font-lexend text-gray-700 text-[15px]">{row.name}</td>
                <td className="px-4 py-2 font-lexend text-gray-700 text-[15px]">{row.zoneId}</td>
                <td className="px-4 py-2 font-lexend text-gray-700 text-[15px]">
                  <span
                    className="relative px-2 py-2.5 rounded text-base hover:cursor-pointer"
                    onClick={() => setEdit(row.id)}
                  >
                    <HiOutlineDotsHorizontal />
                    {edit === row.id && (
                      <div
                        className="absolute top-0 z-10 right-4 flex-col w-36 p-4 text-xs bg-white rounded shadow-md"
                        onMouseLeave={() => setEdit(null)}
                      >
                        <p className="hover:cursor-pointer mb-2 font-lexend text-gray-700 text-[10px]">View Details</p>
                        <p className="hover:cursor-pointer font-lexend text-gray-700 text-[10px]">Remove</p>
                        <p className="hover:cursor-pointer font-lexend text-gray-700 text-[10px]">Delete</p>
                      </div>
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}
            </div>
        </div>
    );
};

const Original: React.FC = () => {
    const [activeTab, setActiveTab] = useState<number>(1);

    const handleTabClick = (tabId: number) => {
        setActiveTab(tabId);
    };

    return (
        <>
            <div className="container mx-auto mt-8">
                <div className="flex flex-wrap mb-4">
                    {tabData.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className={px-4 py-2 border rounded transition duration-300 ${activeTab === tab.id
                                ? 'bg-blue-800 text-white font-lexend text-[15px]'
                                : 'bg-white text-gray-600 hover:bg-gray-200 hover:text-gray-800'}}>
                    {tab.title}
                </button>
        ))}
            </div>
            <div className="p-4 bg-white rounded-b-lg">
                <>
                    {activeTab === 1 && (
                        <p>Table 1</p>
                    )}
                    {activeTab === 2 && (
                        <p>Table 2</p>
                    )}
                    {activeTab === 3 && (
                        <p>Table 3</p>
                    )}
                </>
                {/*<TabItem tabData={tabData.find((tab) => tab.id === activeTab) || tabData[0]} />*/}
            </div>
        </div >
    </>
    
  );
};

export default Original;