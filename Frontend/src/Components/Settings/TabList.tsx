// TabList.jsx
import React, { useEffect, useState } from 'react';
import TableComponent from './TableComponent';
import apiCall from '../../Api/apiCall';


interface TabData {
  id: number;
  title: string;
  endpoint: string;
}

const tabData: TabData[] = [
  { id: 1, title: 'Rating District', endpoint: '' },
  { id: 2, title: 'Street', endpoint: 'street' },
  { id: 3, title: 'Cadastral Zone', endpoint: 'cadastral-zone' },
  { id: 4, title: 'Property Type', endpoint: 'propert-type' },
  { id: 5, title: 'Property Use', endpoint: 'properety-use' },
  { id: 6, title: 'Category', endpoint: 'category' },
  { id: 7, title: 'Office Zone', endpoint: '' },
  { id: 8, title: 'Particular Street', endpoint: '' },
];

const TabList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(2);
  const [currentEndpoint, setCurrerntEndpoint] = useState<string>("street");
  const [tableData, setTableData] = useState<[]>([])
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tableHeader, setTableHeader] = useState<string[]>([])

  const handleTabClick = (tabId: number) => {
    setActiveTab(tabId);
    const activeEndpoint = tabData.find((tab) => tab.id === tabId)?.endpoint;
    setCurrerntEndpoint(activeEndpoint || "street");
    console.log(tabId);
    console.log(activeEndpoint)

  };
  const fetching = async (endpoint) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall<any>({
        endpoint: endpoint,
        method: "get",

      })

      if (response.status === 200) {
      let finalresponse:any = []
      switch (currentEndpoint) {
        case "street":
          finalresponse= await Street(response?.data?.data)
          console.log("finalresponse street",finalresponse)
          break

      }
        setTableData(finalresponse)
       // setTableData(response?.data?.data)
        const headerKeys = await Object.keys(finalresponse[0]).filter(key => key !== 'updated_at' && key !== 'created_at');
        //setTableHeader(headerKeys)
        console.log(headerKeys);
        console.log(response?.data.data)
        //console.log(tableHeader)
        // setStreets(response.data.data)
        //setTableData(response.data);

        
        
        setTableHeader(headerKeys)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetching(currentEndpoint)
  }, [currentEndpoint]);

  function Street(data) {
    var newdata :any = []
    data.map((value)=>{
    let newstructure = {
      "name": value.name,
      
    }
    newdata.push(newstructure)

    })
    return newdata
  }

  // const activeEndpoint = tabData.find((tab) => tab.id === activeTab)?.endpoint;

  return (
    <div className="container mx-auto mt-8">
      <div className="flex flex-wrap mb-4">
        {tabData.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`px-4 py-2 border rounded transition duration-300 ${activeTab === tab.id
                ? 'bg-blue-800 text-white font-lexend text-[15px]'
                : 'bg-white text-gray-600 hover:bg-gray-200 hover:text-gray-800'
              }`}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="p-4 bg-white rounded-b-lg">
        <TableComponent loading={loading} tableData={tableData} tableHeader={tableHeader} />
      </div>
    </div>
  );
};

export default TabList;
