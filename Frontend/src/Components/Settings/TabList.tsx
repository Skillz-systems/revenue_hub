import React, { useEffect, useState } from 'react';
import TableComponent from './TableComponent';
import apiCall from '../../Api/apiCall';

interface TabData {
  id: number;
  title: string;
  endpoint: string;
  formFields: { label: string, name: string, type: string }[];
  postEndpoint: string;
}

const tabData: TabData[] = [
  { id: 1, title: 'Rating District', endpoint: 'rating-district', formFields: [{ label: 'Name', name: 'name', type: 'text' }], postEndpoint: '/rating-district/create' },
  { id: 2, title: 'Street', endpoint: 'street', formFields: [{ label: 'Name', name: 'name', type: 'text' }], postEndpoint: '/street/create' },
  { id: 3, title: 'Cadastral Zone', endpoint: 'cadastral-zone', formFields: [{ label: 'Name', name: 'name', type: 'text' }, { label: 'Rating District', name: 'rating_district', type: 'text' }], postEndpoint: '/cadastral-zone/create' },
  { id: 4, title: 'Property Type', endpoint: 'property-type', formFields: [{ label: 'Name', name: 'name', type: 'text' }, { label: 'Property ID', name: 'property_id', type: 'number' }], postEndpoint: '/property-type/create' },
  { id: 5, title: 'Property Use', endpoint: 'property-use', formFields: [{ label: 'Name', name: 'name', type: 'text' }], postEndpoint: '/property-use/create' },
  { id: 6, title: 'Category', endpoint: 'category', formFields: [{ label: 'Name', name: 'name', type: 'text' }], postEndpoint: '/category/create' },
  { id: 7, title: 'Office Zone', endpoint: 'office-zone', formFields: [{ label: 'Name', name: 'name', type: 'text' }], postEndpoint: '/office-zone/create' },
  { id: 8, title: 'Particular Street', endpoint: 'particular-street', formFields: [{ label: 'Name', name: 'name', type: 'text' }, { label: 'Street ID', name: 'street_id', type: 'number' }], postEndpoint: '/particular-street/create' },
];

const TabList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(2);
  const [currentTabData, setCurrentTabData] = useState<TabData>(tabData[1]);
  const [tableData, setTableData] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tableHeader, setTableHeader] = useState<string[]>([]);
  const [data, setData] = useState<[]>([]);

  const handleTabClick = (tabId: number) => {
    setActiveTab(tabId);
    const activeTabData = tabData.find((tab) => tab.id === tabId);
    setCurrentTabData(activeTabData || tabData[1]);
  };

  const fetching = async (endpoint: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall<any>({
        endpoint: endpoint,
        method: "get",
      });

      if (response.status === 200) {
        const finalresponse = await transformData(response?.data?.data, currentTabData.endpoint);
        setTableData(finalresponse);
        setData(response?.data?.data);
        const headerKeys = await Object.keys(finalresponse[0]).filter(key => key !== 'updated_at' && key !== 'created_at');
        setTableHeader(headerKeys);
      }
    } catch (error) {
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  const transformData = async (data: any, endpoint: string) => {
    const transformations: { [key: string]: (data: any) => any } = {
      'street': Street,
      'cadastral-zone': cadastralZone,
      'property-type': propertyType,
      // Add other transformations as needed
      'default': defaultEndpoint
    };

    return transformations[endpoint] ? transformations[endpoint](data) : transformations['default'](data);
  };

  const Street = (data: any) => data.map((value: any) => ({ name: value.name }));

  const cadastralZone = (data: any) => data.map((value: any) => ({
    name: value.name,
    rating_district: value.rating_district.name,
  }));

  const propertyType = (data: any) => data.map((value: any) => ({
    name: value.name,
    property_id: value.property_id,
  }));

  const defaultEndpoint = (data: any) => data.map((value: any) => ({ name: value.name }));

  useEffect(() => {
    fetching(currentTabData.endpoint);
  }, [currentTabData]);

  return (
    <div className="container mx-auto mt-8">
      <div className="grid grid-cols-4 gap-4">
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
        <TableComponent
          loading={loading}
          tableData={tableData}
          data={data}
          tableHeader={tableHeader}
          endpoints={currentTabData.title}
          formFields={currentTabData.formFields}
          postEndpoint={currentTabData.postEndpoint}
        />
      </div>
    </div>
  );
};

export default TabList;
