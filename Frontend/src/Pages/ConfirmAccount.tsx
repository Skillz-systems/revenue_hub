import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import images from "../assets";
import { InputComponent } from "../Components/Index";
import axios from "axios";
import Cookies from "js-cookie";
import useSWR from "swr";
import { useTokens, fetcher } from "../Utils/client";

function ConfirmAccount(): JSX.Element {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isLoading, setIsLoading] = useState(false);
    const [errorState, setErrorState] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
    });
    const navigate = useNavigate();
    const { token } = useTokens();
    const { id: userId } = useParams()

    const { data: staff, error: staffError } = useSWR(
        token && userId ? `https://api.revenuehub.skillzserver.com/api/staff/${userId}` : null, // Only fetch if token and userId exists
        (url) => fetcher(url, token)
    );


    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setErrorState(null);
    };

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("FORM DATA:", formData);

        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber) {
            return alert("Please fill in all fields");
        }

        setIsLoading(true);
        setErrorState(null); // Clear any previous error messages

        try {
            const response = await axios.put(`https://api.revenuehub.skillzserver.com/api/staff/${userId}`, {
                name: formData.firstName,
                email: formData.email,
                phone: formData.phoneNumber,
                role_id: userId,
                // zone: 
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );

            if (response.status === 200) {
                console.log(response.data);
                Cookies.set("userToken", response.data.data.token, { expires: 7 }); // Token expires in 7 days
                Cookies.set("userData", JSON.stringify(response.data.data), { expires: 7 }); // Token expires in 7 days
                navigate("/");
            } else if (response.status === 400) {
                console.log(response.data);
                alert(response.data.message);
            } else if (response.status === 401) {
                console.log(response.data);
                alert(response.data.message);
            } else {
                console.log(response);
                alert("Something went wrong!");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorState("Invalid email or phone number. Please try again.");
            } else {
                console.error("Internal Server Error:", error);
                setErrorState("Internal Server Error. Please try again later.");
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (staff) {
            setFormData({
                firstName: staff.data.name || "",
                lastName: "",
                email: staff.data.email || "",
                phoneNumber: staff.data.phone || "",
            });
        }
    }, [staff]);

    return (
        <div className="flex flex-col items-center justify-center w-full h-screen px-4 py-5 overflow-y-auto md:pt-8 md:p-12 lg:pt-12 lg:flex-row lg:p-16 bg-gradient-to-r from-blue-300 via-purple-200 to-red-100 overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white">
            <div className="hidden items-center justify-center lg:flex lg:w-[60%] w-full">
                <img src={images.Key} alt="Padlock" className="w-48 lg:w-[300px]" />
            </div>
            <form
                onSubmit={handleFormSubmit}
                className="flex flex-col px-7 py-12 lg:py-5 lg:px-16 items-center space-y-10 md:space-y-8 justify-center w-full lg:w-[40%] rounded-xl md:rounded-md bg-white bg-opacity-20 shadow-2xl lg:mt-8"
            >
                <div className="flex items-center justify-center w-full pt-2 md:hidden">
                    <img src={images.logo} alt="Logo" className="w-40 md:w-[100px]" />
                </div>
                <div className="flex flex-col w-full gap-2 text-center lg:text-left">
                    <span className="text-color-text-one font-bold text-2xl md:text-[24px] leading-6">
                        Welcome Back
                    </span>
                    <span className="font-bold text-sm lg:text-[14px] text-color-text-two uppercase">
                        Please provide your details to continue
                    </span>
                </div>
                <div className="flex flex-col w-full space-y-4 md:space-y-3">
                    <InputComponent
                        inputContainer="flex items-center justify-between border border-custom-color-one rounded"
                        inputType="text"
                        inputName="firstName"
                        inputValue={formData.firstName}
                        handleInputChange={handleInputChange}
                        placeholder="First Name"
                        required={true}
                        inputStyle="text-color-text-two h-12 md:h-[48px] bg-white rounded-l outline-none px-3 py-2  md:px-4 md:py-2 w-full font-lexend text-xs"
                    />
                    <InputComponent
                        inputContainer="flex items-center justify-between border border-custom-color-one rounded"
                        inputType="text"
                        inputName="lastName"
                        inputValue={formData.lastName}
                        handleInputChange={handleInputChange}
                        placeholder="Last Name"
                        required={true}
                        inputStyle="text-color-text-two h-12 md:h-[48px] bg-white rounded-l outline-none px-3 py-2  md:px-4 md:py-2 w-full font-lexend text-xs"
                    />
                    <InputComponent
                        inputContainer="flex items-center justify-between border border-custom-color-one rounded"
                        inputType="email"
                        inputName="email"
                        inputValue={formData.email}
                        handleInputChange={handleInputChange}
                        placeholder="Email"
                        required={true}
                        inputStyle="text-color-text-two h-12 md:h-[48px] bg-white rounded-l outline-none px-3 py-2  md:px-4 md:py-2 w-full font-lexend text-xs"
                    />
                    <InputComponent
                        inputContainer="flex items-center justify-between border border-custom-color-one rounded"
                        inputType="text"
                        inputName="phoneNumber"
                        inputValue={formData.phoneNumber}
                        handleInputChange={handleInputChange}
                        placeholder="Phone Number"
                        required={true}
                        inputStyle="text-color-text-two h-12 md:h-[48px] bg-white rounded-l outline-none px-3 py-2  md:px-4 md:py-2 w-full font-lexend text-xs"
                    />
                    <InputComponent
                        inputContainer="flex items-center justify-between gap-1 bg-primary-color rounded"
                        inputType="submit"
                        inputValue={isLoading ? "Submitting..." : "Submit"}
                        inputStyle="h-12 mg:h-[48px] rounded outline-none px-1 py-0.5 md:px-2 md:py-1 w-full font-lexend text-sm md:text-base font-medium text-white hover:cursor-pointer"
                    />
                    <p className="text-xs font-lexend text-color-dark-red">{errorState}</p>
                </div>
                <div className="items-center justify-center hidden w-full pt-2 md:flex">
                    <img src={images.logo} alt="Logo" className="w-32 md:w-[100px]" />
                </div>
            </form>
        </div>
    );
}

export default ConfirmAccount;
