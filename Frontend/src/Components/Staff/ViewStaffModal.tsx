import React from "react";
import { GiJusticeStar } from "react-icons/gi";
import { IoPersonCircle } from "react-icons/io5";
import { MdCancel, MdLocationPin } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { userData } from "../Index";

const ViewStaffModal = ({
  hideViewStaffModal,
  propertyModalTransition,
  customTableData,
}) => {
  const { deleteStaffById } = userData();
  return (
    <div
      className={`flex-col relative bg-white rounded overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white ${
        propertyModalTransition
          ? "w-6/12 transition-all ease-in-out duration-500"
          : "w-32"
      }`}
      style={{ height: "95vh" }}
    >
      <img
        src={"/lightCheckeredBackgroundPattern.png"}
        alt="Checkered Background"
        className="absolute top-0 left-0 z-0 w-1/2"
      />
      <div className="absolute z-10 flex-col w-full p-4 space-y-3 ">
        <div
          className="flex items-start justify-between"
          style={{ height: "10vh" }}
        >
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-color-text-two">
              STAFF ID
            </h3>
            <p className="text-base font-bold text-color-text-one">
              {customTableData?.id}
            </p>
            <span
              className={`rounded-xl px-1 py-0.5 text-[10px] font-light font-lexend text-darkerblueberry border-0.6 border-custom-grey-100
                  ${
                    customTableData?.role.name === "Manager"
                      ? "bg-color-light-red"
                      : customTableData?.role.name === "Officer"
                      ? "bg-color-light-yellow"
                      : customTableData?.role.name === "Admin"
                      ? "bg-color-bright-green text-white"
                      : "bg-primary-color text-white"
                  }
                      `}
            >
              {customTableData?.role.name.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="flex items-center justify-center w-[24px] h-[24px] text-xs text-custom-grey-300 font-lexend font-medium px-0.5 border border-custom-grey-100 rounded hover:cursor-pointer"
              onClick={() => deleteStaffById(customTableData.id)}
              title="Delete Staff from Record"
            >
              <RiDeleteBin5Fill />
            </span>
            <span
              className="flex items-center justify-center w-[24px] h-[24px] text-xs text-color-dark-red font-lexend font-medium px-0.5 border border-color-dark-red rounded hover:cursor-pointer"
              onClick={hideViewStaffModal}
              title="Close Staff Modal"
            >
              <MdCancel />
            </span>
          </div>
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
                value: customTableData?.id,
              },
              {
                name: "Name",
                value: customTableData?.name,
              },
              // {
              //   name: "Last Name",
              //   value: customTableData.lastName,
              // },
              // {
              //   name: "Middle Name",
              //   value: customTableData.middleName,
              // },
              {
                name: "Email",
                value: customTableData?.email,
              },
              {
                name: "Phone Number",
                value: customTableData?.phone,
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
            customTableData?.role.name === "Manager"
              ? "bg-color-light-red"
              : customTableData?.role.name === "Officer"
              ? "bg-color-light-yellow"
              : customTableData?.role.name === "Admin"
              ? "bg-color-bright-green text-white"
              : "bg-primary-color text-white"
          }
          `}
          >
            {customTableData?.role.name.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center justify-between p-2 space-y-2 border-0.6 rounded bg-white border-custom-color-one font-lexend">
          <div className="flex items-center gap-1.5 text-primary-color">
            <MdLocationPin />
            <p className="text-xs text-darkerblueberry">Zone</p>
          </div>
          <span className="px-2 py-0.5 rounded text-xs bg-custom-grey-100 text-darkerblueberry">
            {customTableData?.zone.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ViewStaffModal;
