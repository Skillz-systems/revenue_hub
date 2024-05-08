import React from 'react';
import images from '../../assets/index';


const Card = ({ icon, title, subtitle, value, style, withSymbol = false, datepicker = false, dateContent, }) => {
    return (
        <div className={` flex flex-col justify-between shadow-md p-4 rounded-md w-full h-[160px] bg-[#F4F6FF] border-border-red-500 ${style}`} >
            <div className='flex justify-between'>
                <div className="flex space-x-4">
                    <div className="size-[40px]">
                        {icon}
                    </div>

                    <div className="flex flex-col justify-center ">
                        <h3 className='text-gray-400 font-lexend font-[400] text-[12px] leading-[14px]'>{title}</h3>
                        <h1 className='text-stone-950 font-bold font-lexend text[14px] leading-[16px]'>{subtitle}</h1>
                    </div>
                </div>
                <div>
                    {datepicker && (<div className='flex space-between h-fit w-fit items-center border rounded-md border-[#CCD0DC] p-1 space-x-1 bg-[#F6F8FA]'>
                        <div className='text-base font-medium tracking-wide text-gray-400 font-lexend'>{dateContent}</div>
                        <div className='h-3 w-[1px] bg-[#CCD0DC]'></div>
                        <img src={images.DateIcon} alt='dateIcon' className='w-4 h-4' />
                    </div>)}
                </div>
            </div>



            <div className="">
                {withSymbol && (<h3 className='text-slate-600'><img src={images.NairaSymbol} alt="Icon" /></h3>)}
                <h1 className='font-normal font-Lora text-[32px]'>{value}</h1>
            </div>
        </div>
    );
};

export default Card;


