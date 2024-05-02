import SearchInput from "../Searchinput/SearchInput";

export default function ProjectLayout() {
  return (
    <div className="flex gap-4 bg-custom-blue-100 h-screen lg:p-4">
      <div className="max-w-60">LEFT</div>
      <div className="w-full bg-white border-0.6 border-custom-border rounded">
        <SearchInput/>
        RIGHT
      </div>
    </div>
  );
}
