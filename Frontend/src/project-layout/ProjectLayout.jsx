import SideBarMenu from "../side-bar-menu/SideBarMenu";

export default function ProjectLayout() {
  return (
    <div className="flex gap-4 bg-custom-blue-100 h-screen lg:p-4">
      <SideBarMenu />
      <div className="w-full bg-white border-0.6 border-custom-color-one rounded">
        RIGHT
      </div>
    </div>
  );
}
