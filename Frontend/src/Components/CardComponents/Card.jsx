import React from 'react';

const Card = ({ icon,type, height, width, title, subtitle, value }) => {
    return (
        <div className="shadow-md ml-2 mt-2 rounded-md" style={{ height, width }}>
            <div className="flex">
                <div className="ml-2">
                    {icon}
                </div>

                <div className="flex flex-col justify-center ml-4 ">
                    <h3 className='text-slate-600'>{title}</h3>
                    <h1 className='text-stone-950 font-bold '>{subtitle}</h1>
                </div>
            </div>

            <div className="ml-2 mt-[25%] ">
                <strong>{value}</strong>
            </div>
        </div>
    );
};

export default Card;


