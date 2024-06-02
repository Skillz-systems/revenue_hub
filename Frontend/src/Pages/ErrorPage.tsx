import React from "react";

const ErrorPage = ({ errorInformation }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-10 bg-slate-200 font-lexend">
      <h1 className="text-4xl font-bold">Oops. Something went wrong</h1>
      <div className="flex items-center justify-center w-[60%]">
        <p className="text-right w-[40%] font-bold text-4xl py-4 pr-6 mr-[0.75em] border-r border-gray-600">
          {errorInformation?.status}
        </p>
        <p className="text-left w-[60%] text-sm">{errorInformation?.message}</p>
      </div>
      <p className="text-sm w-[50%] text-center leading-7">
        Kindly refresh and perform your operation again. If the error persists.
        Kindly report the issue above to the{" "}
        <b>Revenue Hub Portal Administrator.</b>
      </p>
      <button
        className="border-1.5 border-color-text-one py-2 px-8 rounded hover:bg-color-text-one hover:text-slate-200"
        onClick={() => {
          window.location.reload();
        }}
      >
        Return
      </button>
    </div>
  );
};

export default ErrorPage;
