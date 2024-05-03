export default function ProfileBox({
  profileName,
  profileIcon,
  title,
  designation,
  onHideSideBarMenu,
}) {
  return (
    <div className="flex-col w-full p-2 space-y-2 border-0.5 rounded border-custom-color-two">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-color-text-one">
          {profileName}
        </p>
        <span
          className="flex items-center justify-center w-5 h-5 text-xs border rounded-full text-color-text-two bg-custom-blue-200 border-custom-color-two"
          onClick={onHideSideBarMenu}
        >
          {profileIcon}
        </span>
      </div>
      <div className="flex bg-primary-color p-1.5 items-center justify-between rounded">
        <p className="text-xs text-white font-lexend">{title}</p>
        <p className="px-1 text-xs font-semibold uppercase bg-white rounded-sm text-primary-color font-lexend">
          {designation}
        </p>
      </div>
    </div>
  );
}
