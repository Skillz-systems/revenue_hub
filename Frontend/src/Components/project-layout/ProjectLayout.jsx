import SideBarMenu from "../../side-bar-menu/SideBarMenu";
import SearchInput from "../SearchInput/SearchInput";

export default function ProjectLayout() {
  return (
    <div className="flex h-screen gap-4 bg-custom-blue-100 lg:p-4">
      <div className="max-w-60">
        <SideBarMenu />
      </div>
      <div className="w-full bg-white border-0.6 border-custom-border rounded">
        {/* <SearchInput /> */}
        RIGHT
      </div>
    </div>
  );
}
