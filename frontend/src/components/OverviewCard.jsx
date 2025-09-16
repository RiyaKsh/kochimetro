
export default function OverviewCard({ title, value, change, changeColor }) {
  return (
    <div className="bg-gray-100 p-4 rounded shadow">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-2xl">{value}</p>
      <span className={`text-sm font-medium ${changeColor}`}>
        {change}
      </span>
    </div>
  );
}
