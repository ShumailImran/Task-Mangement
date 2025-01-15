import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function Chart({ data }) {
  return (
    <ResponsiveContainer width={"100%"} height={500}>
      <BarChart width={100} height={40} data={data} margin={{ left: -20 }}>
        <XAxis dataKey="name" fontSize={16} />
        <YAxis />
        <Tooltip cursor={{ fill: "transparent" }} />
        <Legend />
        <Bar dataKey="total" fill="#8884d8" barSize={85} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default Chart;
