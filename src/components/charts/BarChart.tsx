import React from 'react';
import {
  BarChart as ReChartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
  LabelList
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface DataPoint {
  [key: string]: string | number;
}

interface BarData {
  dataKey: string;
  color: string;
  name: string;
  stackId?: string;
}

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

interface BarChartProps {
  data: DataPoint[];
  bars: BarData[];
  xAxisDataKey: string;
  yAxisLabel?: string;
  xAxisLabel?: string;
  title?: string;
  stacked?: boolean;
  showLabels?: boolean;
  rotateLabels?: boolean;
  maxBarSize?: number;
  height?: number;
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
        <p className="font-semibold">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const BarChart: React.FC<BarChartProps> = ({
  data,
  bars,
  xAxisDataKey,
  yAxisLabel,
  xAxisLabel,
  title,
  stacked = false,
  showLabels = false,
  rotateLabels = false,
  maxBarSize = 60,
  height = 400,
}) => {
  // Assign stackId if stacked is true
  const barsWithStackId = stacked
    ? bars.map(bar => ({
        ...bar,
        stackId: bar.stackId || 'stack1',
      }))
    : bars;

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <ReChartsBarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: rotateLabels ? 60 : 30,
          }}
          barSize={maxBarSize}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.6} vertical={false} />
          <XAxis
            dataKey={xAxisDataKey}
            tick={{ fontSize: 12 }}
            tickMargin={rotateLabels ? 20 : 5}
            angle={rotateLabels ? -45 : 0}
            textAnchor={rotateLabels ? "end" : "middle"}
            label={
              xAxisLabel
                ? {
                    value: xAxisLabel,
                    position: 'insideBottom',
                    offset: -15,
                    fontSize: 12,
                  }
                : undefined
            }
          />
          <YAxis
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
          {barsWithStackId.map((bar) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name}
              fill={bar.color}
              stackId={bar.stackId}
              radius={stacked ? [0, 0, 0, 0] : [4, 4, 0, 0]}
            >
              {showLabels && (
                <LabelList
                  dataKey={bar.dataKey}
                  position="top"
                  formatter={(value: number) => (value > 0 ? value : '')}
                  style={{ fontSize: 11 }}
                />
              )}
            </Bar>
          ))}
        </ReChartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
