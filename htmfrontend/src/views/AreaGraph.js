import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
// data.length > 0 ? parseInt(data[0].InValue) * 2 : 0
const AreaGraph = ({ data }) => {
  const max = data.reduce(
    (acc, data) => (acc = acc > parseInt(data.InValue) ? acc : data.InValue),
    0
  );
  const min = data.reduce(
    (acc, data) => (acc = acc < parseInt(data.InValue) ? acc : data.InValue),
    data.InValue
  );

  let min2 = parseInt(min) - 500;
  let max2 = parseInt(max) + 500;
  // console.log(max2, "max val");
  // console.log(min2, "min val");
  // console.log(data.length > 0 ? data[data.length - 1].InValue / 2 : 0, "abcd");
  return (
    <ResponsiveContainer width="99%" height="100%">
      <AreaChart data={data}>
        <defs>
          {/* <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00F1C4" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#00F1C4" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#51b9d6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#51b9d6" stopOpacity={0} />
          </linearGradient> */}
        </defs>
        <XAxis dataKey="timeStmp" />
        <YAxis allowDataOverflow={true} domain={[min2, max2]} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="InValue"
          stroke="#51b9d6"
          fill="url(#colorPv)"
          fillOpacity={1}
          strokeWidth={4}
        />

        <Area
          type="monotone"
          dataKey="OneStep"
          stroke="#a52913"
          fill="url(#colorUv)"
          fillOpacity={1}
          strokeWidth={4}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
export default AreaGraph;
