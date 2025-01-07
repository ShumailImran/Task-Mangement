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
      <BarChart width={100} height={40} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip cursor={{ fill: "transparent" }} />
        <Legend />
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <Bar dataKey="total" fill="#8884d8" barSize={85} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default Chart;
