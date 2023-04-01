import React from "react";
import { BarChart, Bar, XAxis, ResponsiveContainer, YAxis } from "recharts";

export default function App({
  data,
  anomaly = false,
  maxDomian = 300,
  minDomain = 0,
}) {
  return (
    <ResponsiveContainer width="99%" height="100%">
      <BarChart width={550} height={400} data={data}>
        <XAxis dataKey="timeStmp" />
        <YAxis allowDataOverflow={true} domain={[minDomain, maxDomian]} />
        {/* {nth && (
          <Bar
            dataKey="nthStep"
            fill="#8884d8"
            fillOpacity={0}
            stroke="red"
            strokeWidth={4}
          />
        )}
        {trending && (
          <Bar
            dataKey="InValue"
            fill="#8884d8"
            fillOpacity={0}
            stroke="purple"
            strokeWidth={4}
          />
        )} */}

        <Bar
          dataKey="AnomalyScore"
          fill="#8884d8"
          fillOpacity={0}
          stroke="#0fefc3"
          strokeWidth={4}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
