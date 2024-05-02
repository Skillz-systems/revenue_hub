export default function ProfileComponent({
  profileTextOne,
  profileIcon,
  profileTextTwo,
  profileTextThree,
  onBackClick,
}) {
  return (
    <div className="flex-col w-full p-2 space-y-2 border-0.5 rounded border-custom-color-two">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-color-text-one">
          {profileTextOne}
        </p>
        <span
          className="flex w-5 h-5 text-xs text-color-text-two bg-custom-blue-200 items-center justify-center border border-custom-color-two rounded-full"
          onClick={onBackClick}
        >
          {profileIcon}
        </span>
      </div>
      <div className="flex bg-primary-color p-1.5 items-center justify-between rounded">
        <p className="text-xs text-white font-lexend">{profileTextTwo}</p>
        <p className="text-xs text-primary-color font-lexend font-semibold uppercase px-1 bg-white rounded-sm">
          {profileTextThree}
        </p>
      </div>
    </div>
  );
}
