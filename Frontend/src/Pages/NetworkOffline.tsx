import React from "react";
import { BiWifiOff } from "react-icons/bi";

const NetworkOffline = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-5 bg-slate-200 font-lexend">
      <div className="text-[200px]">
        <BiWifiOff />
      </div>
      <h1 className="text-4xl font-bold">It seems like you are offline</h1>
      <p className="text-sm w-[50%] text-center leading-7">
        Please check your network router or connect to a stable internet
        connection!
      </p>
      <button
        className="border-1.5 border-color-text-one py-2 px-8 rounded hover:bg-color-text-one hover:text-slate-200"
        onClick={() => {
          window.location.reload();
        }}
      >
        Refresh
      </button>
    </div>
  );
};

export default NetworkOffline;
