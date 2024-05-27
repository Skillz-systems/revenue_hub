import React from 'react';

interface ProfileBoxProps {
  profileName: string;
  profileIcon: React.ReactNode;
  title: string;
  designation: string;
  location: string;
  onHideSideBarMenu: () => void;
}

const ProfileBox: React.FC<ProfileBoxProps> = ({
  profileName,
  profileIcon,
  title,
  designation,
  location,
  onHideSideBarMenu,
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
      <div className="flex bg-primary-color p-1.5 items-center justify-between rounded">
        <p className="text-xs text-white font-lexend">{title}</p>
        <span className="flex gap-1">
          <p className="px-1 text-xs font-semibold uppercase bg-white rounded-sm text-primary-color font-lexend">
            {designation}
          </p>
          <p className="px-1 text-xs font-semibold uppercase bg-white rounded-sm text-primary-color font-lexend">
            {location}
          </p>
        </span>
      </div>
    </div>
  );
};

export default ProfileBox;
