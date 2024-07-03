import React from "react";

interface ProfileBoxProps {
  profileName: string;
  profileIcon: React.ReactNode;
  title: string;
  designation: string;
  location: string;
  onHideSideBarMenu: () => void;
  handleViewProfile: () => void;
}

const ProfileBox: React.FC<ProfileBoxProps> = ({
  profileName,
  profileIcon,
  title,
  designation,
  location,
  onHideSideBarMenu,
  handleViewProfile,
}) => {
  return (
    <div className="flex-col w-full p-2 space-y-2 border-0.5 rounded border-custom-color-two">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-color-text-one">
          {profileName}
        </p>
        <span
          className="flex items-center justify-center w-5 h-5 text-xs border rounded-full text-color-text-two bg-custom-blue-200 border-custom-color-two"
          onClick={onHideSideBarMenu}
          title="Shrink Sidebar Menu"
        >
          {profileIcon}
        </span>
      </div>
      <div
        className="flex w-full gap-1 flex-col space-y-1.5 items-start lg:space-y-0 lg:flex-row bg-primary-color p-1.5 lg:items-center justify-between rounded"
        onClick={handleViewProfile}
      >
        <p className="text-xs text-white font-lexend hover:underline lg:hover:no-underline">
          {title}
        </p>
        <div className="flex w-full gap-1 lg:justify-end lg:w-[75%]">
          <span
            className="px-1 text-xs font-semibold uppercase bg-white rounded-sm ellipsis text-primary-color font-lexend w-[50%] lg:w-auto"
            title={designation}
          >
            {designation}
          </span>
          <span
            className="px-1 text-xs font-semibold uppercase bg-white rounded-sm ellipsis text-primary-color font-lexend w-[50%] lg:w-auto"
            title={location}
          >
            {location}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileBox;
