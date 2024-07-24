import React, { useEffect, useState } from 'react';
import apiCall from '../../../Api/apiCall';
import { OfficeZoneModal } from './OfficeZoneModal';
import OfficeZoneRowActions from './OfficeZoneRowActions';


export type OfficeZoneData = {
    name: string;
    id?: string;
};

export const OfficeZoneTable = () => {
    const [tableData, setTableData] = useState<OfficeZoneData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetching = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiCall<{ data: OfficeZoneData[] }>({
                endpoint: "office-zone",
                method: "get",
            });
            if (response.status === 200) {
                setTableData(response.data.data);
            }
        } catch (error) {
            setError("An error occurred while fetching data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetching();
    }, []);

    const handleActionComplete = () => {
        fetching();
    };

    if (loading) return <p className="text-center text-blue-500">Loading data, please wait...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="relative">
            <OfficeZoneModal />
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left border font-medium font-lexend text-gray-700 text-[10px]">SN</th>
                            <th className="px-4 py-2 text-left border font-medium font-lexend text-gray-700 text-[10px]">Office Zone Name</th>
                            <th className="px-4 py-2 text-left border font-medium font-lexend text-gray-700 text-[10px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((item, index) => (
                            <tr key={item.id || index} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2 font-lexend text-gray-700 text-[15px]">{index + 1}</td>
                                <td className="px-4 py-2 font-lexend text-gray-700 text-[15px]">
                                    {item.name}
                                </td>
                                <td className="px-4 py-2 font-lexend text-gray-700 text-[15px] relative">
                                    <OfficeZoneRowActions
                                        data={{ ...item, id: item.id || `default-id-${index}` }}
                                        onActionComplete={handleActionComplete}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
};
