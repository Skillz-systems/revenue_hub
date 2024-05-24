import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import Cookies from 'js-cookie';

const fetcher = async (url: string, token: any) => {
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch data');
    }
};

const userData = () => {
    const [accountInformation, setAccountInformation] = useState<any>(null);
    const [staffInformation, setStaffInformation] = useState<any>(null);

    // Safely get and parse userData from cookies
    const userData = Cookies.get('userData');
    let token: string | undefined;
    let userId: string | undefined;

    try {
        const parsedData = userData ? JSON.parse(userData) : null;
        // Safely access token
        token = parsedData?.token;
        userId = parsedData?.user?.id;
    } catch (error) {
        console.error('Error parsing userData cookie:', error);
        token = undefined;
        userId = undefined;
    }

    const { data: staff, error: staffError } = useSWR(
        token && userId ? `https://api.revenuehub.skillzserver.com/api/staff/${userId}` : null, // Only fetch if token and userId exists
        (url) => fetcher(url, token)
    );

    const { data: allStaff, error: allStaffError } = useSWR(
        token ? "https://api.revenuehub.skillzserver.com/api/staff" : null, // Only fetch if token exists
        (url) => fetcher(url, token)
    );

    useEffect(() => {
        if (staff) {
            console.log("USER DATA:", staff)
            setAccountInformation(staff.data);
        } if (allStaff) {
            setStaffInformation(allStaff.data)
        }
    }, [staff, allStaff]);

    useEffect(() => {
        if (staffError) {
            console.error('Error fetching staff information:', staffError);
        } if (allStaffError) {
            console.error('Error fetching All Staff information:', allStaffError);
        }
    }, [staffError, allStaffError]);

    const deleteStaffById = async (staffId: number) => {
        try {
            const response = await axios.delete(`https://api.revenuehub.skillzserver.com/api/staff/${staffId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Add your authorization token if needed
                },
            });

            if (response.status === 204) {
                // Remove the deleted staff from the state
                setStaffInformation(prevStaff => prevStaff.filter(staff => staff.id !== staffId));
                alert('Staff deleted successfully');
            } else {
                alert('Failed to delete staff');
            }
        } catch (error) {
            console.error('Error deleting staff:', error);
            alert('An error occurred while deleting the staff');
        }
    };

    return {
        accountInformation,
        staffInformation,
        deleteStaffById,
    };
};

export default userData;
