import React from 'react';
import {
  LineChart as ReChartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface DataPoint {
  year: number;
  [key: string]: number | string;
}

interface LineChartProps {
  data: DataPoint[];
  lines: {
    key: string;
    color: string;
    name: string;
    strokeWidth?: number;
  }[];
  xAxisDataKey?: string;
  yAxisLabel?: string;
  title?: string;
  yAxisDomain?: [number, number];
}

// Custom tooltip component
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="font-semibold">{`Year: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value !== undefined ? Number(entry.value).toFixed(2) : 'N/A'}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const LineChart: React.FC<LineChartProps> = ({
  data,
  lines,
  xAxisDataKey = 'year',
  yAxisLabel,
  title,
  yAxisDomain,
}) => {
  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={400}>
        <ReChartsLineChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.6} />
          <XAxis 
            dataKey={xAxisDataKey} 
            tick={{ fontSize: 12 }}
            padding={{ left: 20, right: 20 }}
            label={{ 
              value: 'Year', 
              position: 'insideBottom', 
              offset: -10,
              fontSize: 12
            }}
          />
          <YAxis
            domain={yAxisDomain || [0, 'auto']}
            tick={{ fontSize: 12 }}
            label={
              yAxisLabel
                ? {
                    value: yAxisLabel,
                    angle: -90,
                    position: 'insideLeft',
                    fontSize: 12,
                  }
                : undefined
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={line.strokeWidth || 2}
              dot={{ r: 3, strokeWidth: 1 }}
              activeDot={{ r: 5, strokeWidth: 1 }}
            />
          ))}
        </ReChartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
