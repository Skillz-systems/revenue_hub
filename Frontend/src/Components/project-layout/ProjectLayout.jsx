import Card from "../CardComponents/Card";


export default function ProjectLayout() {
  return (
    <div className="flex gap-4 bg-custom-blue-100 h-screen lg:p-4">
      <div className="max-w-60">LEFT</div>
      <div className="w-full bg-white border-0.6 border-custom-border rounded">
      <Card
        icon={<img src="path/to/icon.png" alt="Icon" />}
        height="25%"
        width="25%"
        title="Custom Title"
        subtitle="Custom Subtitle"
        value="4,000,444.000"
      />

        RIGHT
      </div>
    </div>
  );
}
