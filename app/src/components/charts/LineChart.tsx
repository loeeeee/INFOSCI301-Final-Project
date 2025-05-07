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

interface LineConfig {
  key: string;
  color: string;
  name: string;
  strokeWidth?: number;
}

interface LineChartProps {
  data: DataPoint[];
  lines: LineConfig[];
  xAxisDataKey?: string;
  yAxisLabel?: string;
  title?: string;
  yAxisDomain?: [number, number];
  isHighContrastMode?: boolean;
  isColorBlindMode?: boolean;
}

// High contrast color palette
const hcLineColors = ['#FFFF00', '#00FFFF', '#FF00FF', '#00FF00', '#FFA500', '#ADFF2F']; // Yellow, Cyan, Magenta, Lime, Orange, GreenYellow
const hcAxisColor = '#FFFFFF';
const hcGridColor = '#555555';
const hcTooltipBg = '#000000';
const hcTooltipBorder = '#AAAAAA';
const hcTextColor = '#FFFFFF';

// Default colors (approximate, Recharts defaults might vary slightly)
const defaultAxisColor = '#666666';
const defaultGridColor = '#cccccc';
const defaultTooltipBg = '#FFFFFF';
const defaultTooltipBorder = '#dddddd';
const defaultTextColor = '#333333';

// Color-Blind friendly palette (Example: Paul Tol Vibrant / IBM Color Blind Safe)
const cbLineColors = [
  '#0077BB', // Blue
  '#EE7733', // Orange
  '#009988', // Teal
  '#EE3377', // Magenta
  '#CCBB44', // Yellow
  '#BBBBBB', // Grey
];

interface CustomTooltipInternalProps extends TooltipProps<ValueType, NameType> {
  isHighContrastMode?: boolean;
}

const CustomTooltip: React.FC<CustomTooltipInternalProps> = ({
  active,
  payload,
  label,
  isHighContrastMode,
}) => {
  if (active && payload && payload.length) {
    const wrapperClasses = `p-3 border shadow-md rounded-md ${isHighContrastMode ? 'bg-black border-gray-600' : 'bg-white border-gray-200'}`;
    const labelColor = isHighContrastMode ? hcTextColor : defaultTextColor;

    return (
      <div className={wrapperClasses}>
        <p className="font-semibold" style={{ color: labelColor }}>{`Year: ${label}`}</p>
        {payload.map((entry, index) => {
          const valueColor = entry.color;
          return (
            <p key={`item-${index}`} style={{ color: valueColor }}>
              {`${entry.name}: ${entry.value !== undefined ? Number(entry.value).toFixed(2) : 'N/A'}`}
            </p>
          );
        })}
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
  isHighContrastMode = false,
  isColorBlindMode = false,
}) => {
  const currentAxisColor = isHighContrastMode ? hcAxisColor : defaultAxisColor;
  const currentGridColor = isHighContrastMode ? hcGridColor : defaultGridColor;
  const currentTitleColor = isHighContrastMode ? hcTextColor : defaultTextColor;

  // Function to determine line/dot color based on modes
  const getLineColor = (lineConfig: LineConfig, index: number): string => {
    if (isColorBlindMode) {
      return cbLineColors[index % cbLineColors.length];
    } else if (isHighContrastMode) {
      return hcLineColors[index % hcLineColors.length];
    } else {
      return lineConfig.color;
    }
  };

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-medium mb-4" style={{ color: currentTitleColor }}>{title}</h3>}
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
          <CartesianGrid strokeDasharray="3 3" stroke={currentGridColor} opacity={isHighContrastMode ? 0.8 : 0.6} />
          <XAxis 
            dataKey={xAxisDataKey} 
            tick={{ fontSize: 12, fill: currentAxisColor }}
            stroke={currentAxisColor}
            padding={{ left: 20, right: 20 }}
            label={{ 
              value: 'Year', 
              position: 'insideBottom', 
              offset: -10,
              fontSize: 12,
              fill: currentAxisColor
            }}
          />
          <YAxis
            domain={yAxisDomain || [0, 'auto']}
            tick={{ fontSize: 12, fill: currentAxisColor }}
            stroke={currentAxisColor}
            label={
              yAxisLabel
                ? {
                    value: yAxisLabel,
                    angle: -90,
                    position: 'insideLeft',
                    fontSize: 12,
                    fill: currentAxisColor
                  }
                : undefined
            }
          />
          <Tooltip content={<CustomTooltip isHighContrastMode={isHighContrastMode} />} />
          <Legend 
            verticalAlign="top" 
            height={36} 
            wrapperStyle={{ color: currentAxisColor }}
          />
          {lines.map((line, index) => {
            const resolvedLineColor = getLineColor(line, index);
            return (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.name}
                stroke={resolvedLineColor}
                strokeWidth={line.strokeWidth || 2}
                dot={{ r: 3, strokeWidth: 1, fill: resolvedLineColor }}
                activeDot={{ r: 5, strokeWidth: 1, fill: resolvedLineColor }}
                color={resolvedLineColor}
              />
            );
          })}
        </ReChartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
