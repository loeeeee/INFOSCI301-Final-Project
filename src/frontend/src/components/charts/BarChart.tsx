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

interface BarConfig { // Renamed from BarData for clarity
  dataKey: string;
  color: string; // Original color
  name: string;
  stackId?: string;
}

interface BarChartProps {
  data: DataPoint[];
  bars: BarConfig[];
  xAxisDataKey: string;
  yAxisLabel?: string;
  xAxisLabel?: string;
  title?: string;
  stacked?: boolean;
  showLabels?: boolean;
  rotateLabels?: boolean;
  maxBarSize?: number;
  height?: number;
  isHighContrastMode?: boolean;
  isColorBlindMode?: boolean; // Added prop
}

// High contrast color palette (consistent with LineChart)
const hcBarColors = ['#FFFF00', '#00FFFF', '#FF00FF', '#00FF00', '#FFA500', '#ADFF2F']; // Yellow, Cyan, Magenta, Lime, Orange, GreenYellow
const hcAxisColor = '#FFFFFF';
const hcGridColor = '#555555';
const hcTextColor = '#FFFFFF';
const hcLabelListColor = '#FFFFFF';

// Default colors
const defaultAxisColor = '#666666';
const defaultGridColor = '#cccccc';
const defaultTextColor = '#333333';
const defaultLabelListColor = '#333333';

// Color-Blind friendly palette (Example: Paul Tol Vibrant / IBM Color Blind Safe)
const cbBarColors = [
  '#0077BB', // Blue
  '#EE7733', // Orange
  '#009988', // Teal
  '#EE3377', // Magenta
  '#CCBB44', // Yellow
  '#BBBBBB', // Grey
];

interface CustomTooltipInternalProps extends TooltipProps<ValueType, NameType> {
  isHighContrastMode?: boolean;
  // isColorBlindMode is not strictly needed here if entry.color is correctly passed
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
        <p className="font-semibold" style={{ color: labelColor }}>{`${label}`}</p>
        {payload.map((entry, index) => {
          // Use color passed from Bar component's payload
          const valueColor = entry.color; 
          return (
            <p key={`item-${index}`} style={{ color: valueColor }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          );
        })}
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
  isHighContrastMode = false,
  isColorBlindMode = false, // Use prop
}) => {
  const barsWithStackId = stacked
    ? bars.map(bar => ({ ...bar, stackId: bar.stackId || 'stack1' }))
    : bars;

  // Axis, grid, title colors primarily follow High Contrast mode
  const currentAxisColor = isHighContrastMode ? hcAxisColor : defaultAxisColor;
  const currentGridColor = isHighContrastMode ? hcGridColor : defaultGridColor;
  const currentTitleColor = isHighContrastMode ? hcTextColor : defaultTextColor;
  const currentLabelListFill = isHighContrastMode ? hcLabelListColor : defaultLabelListColor;

  // Function to determine bar color based on modes
  const getBarColor = (barConfig: BarConfig, index: number): string => {
    if (isColorBlindMode) {
      return cbBarColors[index % cbBarColors.length];
    } else if (isHighContrastMode) {
      return hcBarColors[index % hcBarColors.length];
    } else {
      return barConfig.color; // Use original color from props
    }
  };

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-medium mb-4" style={{ color: currentTitleColor }}>{title}</h3>}
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
          <CartesianGrid strokeDasharray="3 3" stroke={currentGridColor} opacity={isHighContrastMode ? 0.8 : 0.6} vertical={false} />
          <XAxis
            dataKey={xAxisDataKey}
            tick={{ fontSize: 12, fill: currentAxisColor }}
            stroke={currentAxisColor}
            tickMargin={rotateLabels ? 20 : 5}
            angle={rotateLabels ? -45 : 0}
            textAnchor={rotateLabels ? "end" : "middle"}
            label={
              xAxisLabel
                ? { value: xAxisLabel, position: 'insideBottom', offset: -15, fontSize: 12, fill: currentAxisColor }
                : undefined
            }
          />
          <YAxis
            tick={{ fontSize: 12, fill: currentAxisColor }}
            stroke={currentAxisColor}
            label={
              yAxisLabel
                ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fontSize: 12, fill: currentAxisColor }
                : undefined
            }
          />
          <Tooltip content={<CustomTooltip isHighContrastMode={isHighContrastMode} />} />
          <Legend verticalAlign="top" height={36} wrapperStyle={{ color: currentAxisColor }} />
          {barsWithStackId.map((bar, index) => {
            const resolvedBarColor = getBarColor(bar, index);
            return (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                name={bar.name}
                fill={resolvedBarColor} // Use resolved color
                stackId={bar.stackId}
                radius={stacked ? [0, 0, 0, 0] : [4, 4, 0, 0]}
                // Pass color to payload for tooltip
                color={resolvedBarColor} 
              >
                {showLabels && (
                  <LabelList
                    dataKey={bar.dataKey}
                    position="top"
                    formatter={(value: number) => (value > 0 ? value : '')}
                    style={{ fontSize: 11, fill: currentLabelListFill }}
                  />
                )}
              </Bar>
            );
          })}
        </ReChartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
