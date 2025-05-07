import React from 'react';
import {
  ComposedChart as ReChartsComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
  ReferenceLine
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface DataPoint {
  [key: string]: string | number;
}

interface LineConfig {
  dataKey: string;
  name: string;
  color: string;
  yAxisId?: string;
  strokeWidth?: number;
}

interface BarConfig {
  dataKey: string;
  name: string;
  color: string;
  yAxisId?: string;
  stackId?: string;
  radius?: [number, number, number, number];
}

interface ReferenceLineConfig {
  y?: number;
  x?: string | number;
  label?: string;
  color?: string;
  yAxisId?: string;
  strokeDasharray?: string;
}

interface ComposedChartProps {
  data: DataPoint[];
  lines?: LineConfig[];
  bars?: BarConfig[];
  referenceLines?: ReferenceLineConfig[];
  xAxisDataKey: string;
  yAxisLabel?: string;
  secondaryYAxisLabel?: string;
  title?: string;
  height?: number;
  syncId?: string;
  secondaryYAxis?: boolean;
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

const ComposedChart: React.FC<ComposedChartProps> = ({
  data,
  lines = [],
  bars = [],
  referenceLines = [],
  xAxisDataKey,
  yAxisLabel,
  secondaryYAxisLabel,
  title,
  height = 400,
  syncId,
  secondaryYAxis = false,
}) => {
  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <ReChartsComposedChart
          data={data}
          margin={{
            top: 20,
            right: secondaryYAxis ? 30 : 20,
            left: 20,
            bottom: 30,
          }}
          syncId={syncId}
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
              fontSize: 12,
            }}
          />
          <YAxis
            yAxisId="left"
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
          {secondaryYAxis && (
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              label={
                secondaryYAxisLabel
                  ? {
                      value: secondaryYAxisLabel,
                      angle: 90,
                      position: 'insideRight',
                      fontSize: 12,
                    }
                  : undefined
              }
            />
          )}
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />

          {/* Render Bars */}
          {bars.map((bar) => (
            <Bar
              key={`bar-${bar.dataKey}`}
              dataKey={bar.dataKey}
              name={bar.name}
              fill={bar.color}
              yAxisId={bar.yAxisId || 'left'}
              stackId={bar.stackId}
              radius={bar.radius || [4, 4, 0, 0] as [number, number, number, number]}
            />
          ))}

          {/* Render Lines */}
          {lines.map((line) => (
            <Line
              key={`line-${line.dataKey}`}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={line.strokeWidth || 2}
              yAxisId={line.yAxisId || 'left'}
              dot={{ r: 3, strokeWidth: 1 }}
              activeDot={{ r: 5, strokeWidth: 1 }}
            />
          ))}

          {/* Render Reference Lines */}
          {referenceLines.map((line, index) => (
            <ReferenceLine
              key={`ref-line-${index}`}
              y={line.y}
              x={line.x}
              stroke={line.color || '#ff7300'}
              strokeDasharray={line.strokeDasharray || '3 3'}
              label={line.label}
              yAxisId={line.yAxisId || 'left'}
            />
          ))}
        </ReChartsComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComposedChart;
