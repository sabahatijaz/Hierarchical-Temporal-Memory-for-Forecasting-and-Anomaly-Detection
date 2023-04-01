import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
// 8884d8
// F0E5CF
const LineGraph = ({
  data,
  minDomain = 0,
  maxDomain = 500,
  nth = false,
  trending = false,
}) => {
  return (
    <>
      <ResponsiveContainer width="95%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="invalue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F0E5CF" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#F0E5CF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="nthstep" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="timeStmp" />
          <YAxis data domain={[minDomain, maxDomain]} />
          <Tooltip />
          {nth && (
            <Area
              type="monotone"
              dataKey="nthStep"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#nthstep)"
            />
          )}
          {trending && (
            <Area
              type="monotone"
              dataKey="InValue"
              stroke="#F0E5CF"
              fillOpacity={1}
              fill="url(#invalue)"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
};

export default LineGraph;
