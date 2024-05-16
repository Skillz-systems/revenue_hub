import React from 'react';
import images from '../../assets/index';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import BorderColorIcon from '@mui/icons-material/BorderColor';



function PropertyCard({ houseType, paymentStatus }) {
    return (
        <div className="w-full h-fit rounded-md border border-gray-300  space-y-5">
            <div className=" flex items-center justify-between border-b border-gray-300 px-2 py-3">
                {/* TOP LEFT */}
                <div className="flex items-center space-x-1">
                    <span className="font-lora font-bold text-base leading-[1.28] text-black">1237489982</span>
                    <span className="font-lexend font-light leading-[12.5px] text-[10px] bg-pink-200 rounded-full">COMMERCIAL</span>
                </div>
                {/* TOP RIGHT */}
                <div className="flex items-center justify-center rounded-lg bg-pink-500 text-white font-lexend text-xs font-light leading-[12.5] w-[80px] h-[15px]">Ungenerated</div>
            </div>

            <div className='px-2 py-1'>
                <span className=' font-lexend font-normal text-xs leading-[15px] text-blue-900 line-clamp-1'>House 40, Drive 2, Prince and Princes Estate</span>
                <div className="flex items-center space-x-3 mt-2">
                    <div className='flex items-center space-x-1 bg-gray-200 rounded-md'>
                        <img src={images.Ellipse} className='size-[6px]' />
                        <span className='text-blue-900 font-lexend font-light text-xs leading-15  '>Amac 1</span>
                    </div>
                    <div className='flex items-center space-x-1  bg-gray-200 rounded-md'>
                        <img src={images.Ellipse} className='size-[6px]' />
                        <span className='text-blue-900 font-lexend font-light text-xs leading-3.75'>Gwarimpa</span>
                    </div>

                </div>
            </div>

            <div className="flex items-center justify-between gap-1 px-2 py-1 ">
                <div className='w-[71px] h-[15px] rounded-md bg-gray-200 p-1 gap-1'>
                    <p className=' font-lexend font-light text-[10px] leading-[1.25] w-[63px] h-[7px] bg-blue-gray-900'>Rate Payable</p>
                </div>
                <div className='flex items-center space-x-1 '>
                    <img src={images.Vector} className='w-[16px] h-[16px]' />
                    <p className='font-chonburi font-normal text-base leading-[1.2] text-gray-800'>12,000.00</p>
                </div>
            </div>
            <div className="flex justify-between items-center bg-gray-300 px-2 py-3  border-b border-gray-300 p-2">
                <p className='font-lexend font-normal text-xs leading-[1.25] text-gray-500'>Occupied Property</p>
                <div className='flex justify-between space-x-1'>
                    <div className='flex items-center space-x-1'>
                        <div className='w-8 h-8 rounded-md border border-gray-200 p-2 flex items-center justify-center'>
                            <BorderColorIcon className='text-blue-300 w-2 h-2' />
                        </div>
                        <div className='w-8 h-8 rounded-md border border-gray-200 p-2 flex items-center justify-center'>
                            <MoreHorizIcon className='text-blue-300 w-2 h-2' />
                        </div>
                    </div>
                </div>
            </div>

        </div >
    )
}



export default PropertyCard; 