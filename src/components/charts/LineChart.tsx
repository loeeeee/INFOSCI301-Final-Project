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
    lineStyle?: string; // Add optional line style property
  }[];

  xAxisDataKey?: string;
  yAxisLabel?: string;
  title?: string;
  yAxisDomain?: [number, number];
}

// Helper function to get a line style pattern by index
const getLineStyle = (index: number): string => {
  return DASH_ARRAY_PATTERNS[index % DASH_ARRAY_PATTERNS.length];
};

// Predefined dash array patterns for accessibility
const DASH_ARRAY_PATTERNS = [
  '0',       // Solid line
  '5 5',     // Dashed line
  '5 1 1',   // Dotted line
  '5 5 1 5', // Dash-dot line
  '10 5',    // Longer dash
  '1 5',     // More dots
];

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

// A colorblind-friendly categorical color palette (Tol Vibrant)
const COLORBLIND_FRIENDLY_CATEGORICAL_PALETTE = [
  "#0077BB", // Blue
  "#33BBEE", // Cyan
  "#009988", // Teal
  "#EE7733", // Orange
  "#CC3311", // Red
  "#EE3377", // Magenta
  "#BBCC33", // Lime
  "#AAAA00", // Yellow
  "#77AADD", // Light blue
  "#99DDFF", // Light cyan
  "#44AA99", // Mint
  "#DDCC77", // Gold
  "#88CCEE", // Light teal
  "#AA4499", // Purple
  "#FFAABB", // Pink
];

// Helper function to get a color from the palette by index
const getLineColor = (index: number): string => {
  return COLORBLIND_FRIENDLY_CATEGORICAL_PALETTE[index % COLORBLIND_FRIENDLY_CATEGORICAL_PALETTE.length];
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
          {lines.map((line, index) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color || getLineColor(index)} // Use getLineColor if color is not provided
              strokeWidth={line.strokeWidth || 2}
              strokeDasharray={line.lineStyle || getLineStyle(index)} // Use getLineStyle if lineStyle is not provided
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
