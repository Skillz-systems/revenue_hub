import React from 'react';

const Card = () => {
    return (
        <div className=" h-[20%] w-[20%] bg-slate-300 flex flex-col justify-between shadow-md ml-2 mt-2 rounded-md">
            <div className="flex">
                <div className="h-20 w-20 border-2 border-rose-500 ml-2">
                    <h1>Logo</h1>
                </div>

                <div className="h-25 w-25 border-2 border-rose-500 flex flex-col justify-center ml-2 ">
                    <div className='font-light leading-normal '>
                        <h3>Value of Generated</h3>
                    </div>

                    <div className='text-xl font-semibold'>
                        <h1>Demand Notices</h1>
                    </div>
                </div>
            </div>

            <div className="h-20 w-full flex items-center justify-start ml-2">
                <h1><strong>4,44,000,000.</strong></h1>
            </div>
        </div>
    );
};

export default Card;
