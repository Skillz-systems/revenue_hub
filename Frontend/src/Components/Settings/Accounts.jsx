import React from "react";
import { BiSolidEditAlt } from "react-icons/bi";
import { GiJusticeStar } from "react-icons/gi";
import { IoPersonCircle } from "react-icons/io5";
import { MdLocationPin } from "react-icons/md";

export default function Accounts({ currentUserData }) {
  return (
    <div className="relative flex-col items-center justify-center w-8/12 bg-white rounded">
      <img
        src={"/lightCheckeredBackgroundPattern.png"}
        alt="Checkered Background"
        className="absolute top-0 left-0 z-0 w-1/2"
      />
      <div className="absolute z-10 flex-col w-full p-4 space-y-3 border-0.6 border-custom-color-one rounded">
        <div
          className="flex items-start justify-between"
          style={{ height: "10vh" }}
        >
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-color-text-two">
              STAFF ID
            </h3>
            <p className="text-base font-bold text-color-text-one">
              {currentUserData.staffId}
            </p>
          </div>
          {currentUserData.designation === "Admin" ? (
            <div className="flex items-center gap-2">
              <span
                className="flex items-center justify-center w-[24px] h-[24px] text-xs text-primary-color font-lexend font-medium px-0.5 border border-primary-color rounded hover:cursor-pointer"
                onClick={() => alert("Edit Staff")}
                title="Edit Staff"
              >
                <BiSolidEditAlt />
              </span>
            </div>
          ) : null}
        </div>
        <div className="flex-col space-y-6">
          <div className="flex-col p-2 space-y-2 border rounded border-custom-color-two">
            <div className="flex items-center gap-1.5 text-xs text-custom-blue-300 font-lexend">
              <span className="text-lg">
                <IoPersonCircle />
              </span>
              DETAILS
            </div>
            {[
              {
                name: "Staff ID",
                value: currentUserData.staffId,
              },
              {
                name: "First Name",
                value: currentUserData.firstName,
              },
              {
                name: "Last Name",
                value: currentUserData.lastName,
              },
              {
                name: "Middle Name",
                value: currentUserData.middleName,
              },
              {
                name: "Email",
                value: currentUserData.email,
              },
              {
                name: "Phone Number",
                value: currentUserData.phoneNumber,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between font-lexend"
              >
                <p className="px-1 py-0.5 text-darkblueberry rounded bg-lightblue text-xs">
                  {item.name}
                </p>
                <p className="flex w-[50%] justify-end text-xs font-medium text-color-text-black">
                  <span>{item.value}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between p-2 space-y-2 border-0.6 rounded bg-white border-custom-color-one font-lexend">
          <div className="flex items-center gap-1.5 text-primary-color">
            <GiJusticeStar />
            <p className="text-xs text-darkerblueberry">Designation</p>
          </div>
          <span
            className={`px-1 py-0.5 rounded-xl text-[10px] font-light text-darkerblueberry border-[0.4px] border-divider-grey
          ${
            currentUserData.designation === "Manager"
              ? "bg-color-light-red"
              : currentUserData.designation === "Officer"
              ? "bg-color-light-yellow"
              : currentUserData.designation === "Admin"
              ? "bg-color-bright-green text-white"
              : "bg-primary-color text-white"
          }
          `}
          >
            {currentUserData.designation.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center justify-between p-2 space-y-2 border-0.6 rounded bg-white border-custom-color-one font-lexend">
          <div className="flex items-center gap-1.5 text-primary-color">
            <MdLocationPin />
            <p className="text-xs text-darkerblueberry">Zone</p>
          </div>
          <span className="px-2 py-0.5 rounded text-xs bg-custom-grey-100 text-darkerblueberry">
            {currentUserData.staffZone.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
