import React from 'react';
import {
  PieChart as ReChartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
  Sector
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface DataPoint {
  name: string;
  value: number;
  color?: string;
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

interface PieChartProps {
  data: DataPoint[];
  title?: string;
  colors?: string[];
  dataKey?: string;
  nameKey?: string;
  innerRadius?: number;
  outerRadius?: number;
  activeIndex?: number;
  height?: number;
  showLegend?: boolean;
  legendVertical?: 'top' | 'bottom';
}

// Custom tooltip component
const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="font-semibold" style={{ color: data.color }}>
          {data.name}
        </p>
        <p>{`Count: ${data.value}`}</p>
        {payload[0].payload.percentage !== undefined && (
          <p>{`Percentage: ${payload[0].payload.percentage.toFixed(1)}%`}</p>
        )}
      </div>
    );
  }
  return null;
};

// Active shape for hover effect
const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 16}
        fill={fill}
      />
      <text x={cx} y={cy} dy={-10} textAnchor="middle" fill={fill} fontSize={14}>
        {payload.name}
      </text>
      <text x={cx} y={cy} dy={10} textAnchor="middle" fill="#333" fontSize={14} fontWeight="bold">
        {value}
      </text>
    </g>
  );
};

const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  colors = COLORBLIND_FRIENDLY_CATEGORICAL_PALETTE,
  dataKey = 'value',
  nameKey = 'name',
  innerRadius = 0,
  outerRadius = 120,
  activeIndex,
  height = 400,
  showLegend = true,
  legendVertical = 'bottom',
}) => {
  // Calculate percentage for each item
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercentage = data.map(item => ({
    ...item,
    percentage: (item.value / total) * 100,
  }));

  const [activeIdx, setActiveIdx] = React.useState<number | undefined>(activeIndex);

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <ReChartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <Pie
            data={dataWithPercentage}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            labelLine={true}
            activeIndex={activeIdx !== undefined ? activeIdx : undefined}
            activeShape={activeIdx !== undefined ? renderActiveShape : undefined}
            onMouseEnter={(_, index) => setActiveIdx(index)}
            onMouseLeave={() => activeIndex === undefined && setActiveIdx(undefined)}
          >
            {dataWithPercentage.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || colors[index % colors.length]} 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend verticalAlign={legendVertical} layout="horizontal" align="center" />}
        </ReChartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
