import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function PieChartComponent({ data }) {
  // Check if the "dark" class is active
  const isDarkMode = document.documentElement.classList.contains("dark");
  const strokeColor = isDarkMode ? "#121212" : "#FFFFFF"; // Match dark:bg-black or bg-white

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={renderCustomizedLabel}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color}
              stroke={strokeColor}
              strokeWidth={1}
            />
          ))}
        </Pie>
        <Tooltip height={60} />
        <Legend
          layout="horizontal"
          iconType="circle"
          iconSize={10}
          wrapperStyle={{
            paddingTop: 10,
            fontSize: "16px",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default PieChartComponent;
