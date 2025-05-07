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
  color?: string; // Original color, used if not in HC mode
  percentage?: number; // Added by the component
}

interface PieChartProps {
  data: DataPoint[];
  title?: string;
  colors?: string[]; // Default color palette if not in HC and no entry.color
  dataKey?: string;
  nameKey?: string;
  innerRadius?: number;
  outerRadius?: number;
  activeIndex?: number;
  height?: number;
  showLegend?: boolean;
  legendVertical?: 'top' | 'bottom';
  isHighContrastMode?: boolean; // Added for high contrast
  isColorBlindMode?: boolean; // Added prop
}

// High contrast color palette (consistent with other charts)
const hcPieColors = ['#FFFF00', '#00FFFF', '#FF00FF', '#00FF00', '#FFA500', '#ADFF2F'];
const hcTextColor = '#FFFFFF';
const hcTooltipBg = '#000000';
const hcTooltipBorder = '#AAAAAA';

// Default colors
const defaultTextColor = '#333333';
const defaultActiveShapeTextColor = '#333333'; // For text on active shape
const defaultLabelColor = '#000000'; // For pie slice labels

// Color-Blind friendly palette
const cbPieColors = [
  '#0077BB', '#EE7733', '#009988', '#EE3377', '#CCBB44', '#BBBBBB'
];

interface CustomTooltipInternalProps extends TooltipProps<ValueType, NameType> {
  isHighContrastMode?: boolean;
}

const CustomTooltip: React.FC<CustomTooltipInternalProps> = ({
  active,
  payload,
  isHighContrastMode,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const wrapperClasses = `p-3 border shadow-md rounded-md ${isHighContrastMode ? 'bg-black border-gray-600' : 'bg-white border-gray-200'}`;
    const nameColor = data.color || (isHighContrastMode ? hcTextColor : defaultTextColor);
    const textColor = isHighContrastMode ? hcTextColor : defaultTextColor;

    return (
      <div className={wrapperClasses}>
        <p className="font-semibold" style={{ color: nameColor }}>
          {data.name}
        </p>
        <p style={{ color: textColor }}>{`Count: ${data.value}`}</p>
        {payload[0].payload.percentage !== undefined && (
          <p style={{ color: textColor }}>{`Percentage: ${payload[0].payload.percentage.toFixed(1)}%`}</p>
        )}
      </div>
    );
  }
  return null;
};

interface ActiveShapeProps {
  cx: number; cy: number;
  innerRadius: number; outerRadius: number;
  startAngle: number; endAngle: number;
  fill: string; // This fill will be the HC color if in HC mode
  payload: DataPoint;
  value: number;
  isHighContrastMode?: boolean;
}

const renderActiveShape = (props: ActiveShapeProps) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value, isHighContrastMode
  } = props;
  const activeShapeTextColor = isHighContrastMode ? hcTextColor : defaultActiveShapeTextColor;

  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 6} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 8} outerRadius={outerRadius + 10} fill={fill} />
      <text x={cx} y={cy} dy={-12} textAnchor="middle" fill={fill} fontSize={14} fontWeight="bold">
        {payload.name}
      </text>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={activeShapeTextColor} fontSize={14}>
        {value}
      </text>
      <text x={cx} y={cy} dy={28} textAnchor="middle" fill={activeShapeTextColor} fontSize={12}>
        {`(${(payload.percentage || 0).toFixed(1)}%)`}
      </text>
    </g>
  );
};

const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BF9', '#FF6B6B', '#4ECDC4'],
  dataKey = 'value',
  nameKey = 'name',
  innerRadius = 0,
  outerRadius = 120,
  activeIndex: controlledActiveIndex, // Renamed to avoid conflict with state
  height = 400,
  showLegend = true,
  legendVertical = 'bottom',
  isHighContrastMode = false,
  isColorBlindMode = false, // Added prop
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercentage = data.map(item => ({ ...item, percentage: total > 0 ? (item.value / total) * 100 : 0 }));

  const [internalActiveIndex, setInternalActiveIndex] = React.useState<number | undefined>(controlledActiveIndex);

  React.useEffect(() => {
    setInternalActiveIndex(controlledActiveIndex);
  }, [controlledActiveIndex]);
  
  const currentTitleColor = isHighContrastMode ? hcTextColor : defaultTextColor;
  const currentLabelColor = isHighContrastMode ? hcTextColor : defaultLabelColor;
  const currentLegendColor = isHighContrastMode ? hcTextColor : defaultTextColor;

  // Function to determine slice color
  const getSliceColor = (entry: DataPoint, index: number): string => {
    if (isColorBlindMode) {
      return cbPieColors[index % cbPieColors.length];
    } else if (isHighContrastMode) {
      return hcPieColors[index % hcPieColors.length];
    } else {
      return entry.color || colors[index % colors.length]; // Use provided entry color, fallback to default palette
    }
  };

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-medium mb-4" style={{color: currentTitleColor}}>{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <ReChartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: showLegend ? 40 : 20 }}>
          <Pie
            data={dataWithPercentage}
            cx="50%"
            cy={showLegend && legendVertical === 'bottom' ? "45%" : "50%"} // Adjust cy if legend is at bottom
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            fill="#8884d8" // Default fill, overridden by Cell
            dataKey={dataKey}
            nameKey={nameKey}
            labelLine={{ stroke: isHighContrastMode ? hcTextColor : '#888' }}
            label={({ percent, name, value }) => {
              const labelFill = isHighContrastMode ? hcTextColor : defaultLabelColor;
              return <text x={0} y={0} fill={labelFill} fontSize={12} textAnchor="middle">{`${(percent * 100).toFixed(0)}%`}</text>;
            }}
            activeIndex={internalActiveIndex}
            activeShape={(props) => renderActiveShape({...props, isHighContrastMode}) }
            onMouseEnter={(_, index) => setInternalActiveIndex(index)}
            onMouseLeave={() => controlledActiveIndex === undefined && setInternalActiveIndex(undefined)}
          >
            {dataWithPercentage.map((entry, index) => {
              const resolvedFillColor = getSliceColor(entry, index);
              return (
                <Cell 
                  key={`cell-${index}`} 
                  fill={resolvedFillColor} 
                  color={resolvedFillColor} 
                />
              );
            })}
          </Pie>
          <Tooltip content={<CustomTooltip isHighContrastMode={isHighContrastMode} />} />
          {showLegend && <Legend verticalAlign={legendVertical} layout="horizontal" align="center" wrapperStyle={{ color: currentLegendColor }} />}
        </ReChartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
