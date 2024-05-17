import React from 'react';
import images from '../assets';


function LoginPage() {
    return (
        <div className='w-full h-screen text-white  space-y-10 px-10 bg-gradient-to-r from-blue-300 via-purple-200 to-red-100 ' >
            <div className='flex items-center space-y-6  w-[100%] h-[100%] '>
                <div className='flex justify-center items-center w-[60%] h-[100%] '>
                    <img src={images.Key} alt='Key' className='w-[400px] h-[400px] ' />
                </div>
                <div className='w-[550px] h-[705px]  px-16 py-16  flex flex-col justify-between  rounded-md bg-white bg-opacity-20 shadow-lg '>
                    <div class=' w-[166px] h-[39px] flex flex-col  gap-0' >
                        <span class='text-black font-bold text-[24px] leading-6 w-[166px] h-[39px] font-lora'>Welcome Back</span>
                        <span class=' font-bold w-[101px] h-[10px] text-[14px] leading font-lora text-gray-500'>STAFF SIGN IN</span>
                    </div>
                    <div className=' flex flex-col items-center '>
                        <div className="mt-4 w-[422px] h-[48px]">
                            <input type="email" placeholder="Enter email here" className="border border-gray-300 p-2 w-full h-full font-lexend text-[12px] leading-3 font-medium" />
                        </div>
                        <div className="mt-4 w-[422px] h-[48px]">
                            <input type="password" placeholder="Enter password here" className="border border-gray-300 p-2 w-full h-full font-lexend text-[12px] leading-3 font-medium" />
                        </div>
                        <div className="mt-4 w-[422px] h-[48px]">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded w-full h-full font-lexend text-[16px] leading-4 font-medium">Login</button>
                        </div>
                        <div className="mt-8 mb-10 w-[104px] h-[8px] font-lexend leading-3 font-normal text-[12px] relative">
                            <button className="bg-transparent border-none text-blue-500 mb-1">Forget Password</button>
                            <div className=" bottom-0 left-0 w-full border-b border-gray-400"></div>
                        </div>
                        <div className='mt-[20px]'>
                            <img src={images.logo} alt='Key' className='w-[120px] h-[120px] ' />
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}




export default LoginPage