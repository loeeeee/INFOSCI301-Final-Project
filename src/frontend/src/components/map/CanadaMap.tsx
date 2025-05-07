import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import { useData } from '../../context/DataContext';

// GeoJSON data URL for Canada provinces (using local file)
const CANADA_GEO_URL = "/data/geojson/canada.geojson";

// Province code to name mapping
const PROVINCE_CODES: Record<string, string> = {
  "AB": "Alberta",
  "BC": "British Columbia",
  "MB": "Manitoba",
  "NB": "New Brunswick",
  "NL": "Newfoundland and Labrador",
  "NS": "Nova Scotia",
  "NT": "Northwest Territories",
  "NU": "Nunavut",
  "ON": "Ontario",
  "PE": "Prince Edward Island",
  "QC": "Quebec",
  "SK": "Saskatchewan",
  "YT": "Yukon"
};

// Default Color scale
const DEFAULT_COLOR_SCALE = [
  "#edf8fb", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#005824"
];
// High Contrast Color Scale (e.g., shades of yellow/orange)
const HC_COLOR_SCALE = [
  '#FFFFE0', '#FFFACD', '#FAFAD2', '#FFEFD5', '#FFE4B5', '#FFDAB9', '#FFFF00' // Light Yellows to Bright Yellow
];
// Color Blind Friendly Scale (e.g., Viridis or Blue-Yellow-Brown)
const CB_COLOR_SCALE = [
  '#fde725', '#addc30', '#5ec962', '#28ae80', '#21918c', '#3b528b', '#440154' // Viridis example
];
// Other HC Colors
const hcStrokeColor = '#FFFFFF';
const hcDefaultFill = '#333333'; // Dark gray for no data in HC
const hcHoverFill = '#FFFF00';   // Bright Yellow hover
const hcPressedFill = '#00FFFF';  // Bright Cyan pressed

interface CanadaMapProps {
  onProvinceClick?: (province: string, provinceName: string) => void;
  width?: number;
  height?: number;
  showBaseMap?: boolean;
  isHighContrastMode?: boolean;
  isColorBlindMode?: boolean;
}

const CanadaMap: React.FC<CanadaMapProps> = ({ 
  onProvinceClick,
  width = 800,
  height = 500,
  showBaseMap = false,
  isHighContrastMode = false,
  isColorBlindMode = false
}) => {
  const { provinces, loading } = useData();
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  // Determine current color scale and defaults based on modes
  let currentScale: string[];
  let currentDefaultFill: string;
  let currentStroke: string;
  let currentHoverFill: string;
  let currentPressedFill: string;

  if (isColorBlindMode) {
    currentScale = CB_COLOR_SCALE;
    currentDefaultFill = '#bdbdbd'; // Medium grey for CB no data
    currentStroke = isHighContrastMode ? hcStrokeColor : "#FFFFFF"; // Use HC stroke if HC is also on
    currentHoverFill = '#0077BB'; // CB Blue hover
    currentPressedFill = '#EE7733'; // CB Orange pressed
  } else if (isHighContrastMode) {
    currentScale = HC_COLOR_SCALE;
    currentDefaultFill = hcDefaultFill;
    currentStroke = hcStrokeColor;
    currentHoverFill = hcHoverFill;
    currentPressedFill = hcPressedFill;
  } else {
    currentScale = DEFAULT_COLOR_SCALE;
    currentDefaultFill = "#F5F5F5";
    currentStroke = "#FFFFFF";
    currentHoverFill = "#FFD700"; // Default Gold hover
    currentPressedFill = "#E42";   // Default Reddish pressed
  }

  // Function to determine province color based on species count
  const getProvinceColor = (provinceCode: string) => {
    if (!provinces.length) return currentScale[0];
    
    const provinceData = provinces.find(p => p.province === provinceCode);
    
    if (!provinceData) return currentDefaultFill;
    
    // Calculate color based on total species count relative to other provinces
    const allCounts = provinces.map(p => p.totalSpecies);
    const maxCount = Math.max(...allCounts);
    const minCount = Math.min(...allCounts);
    
    // Normalize the count to get a value between 0 and 1
    const range = maxCount - minCount;
    const normalizedCount = range === 0 
      ? 0.5 
      : (provinceData.totalSpecies - minCount) / range;
    
    // Convert normalized value to color index
    const colorIndex = Math.min(
      Math.floor(normalizedCount * currentScale.length),
      currentScale.length - 1
    );
    
    return currentScale[colorIndex];
  };

  // Function to extract province code from geography properties
  const getProvinceCode = (geo: any): string => {
    // Check if geo.properties.code exists, otherwise try to extract from name
    if (geo.properties.code && typeof geo.properties.code === 'string') {
      return geo.properties.code;
    }
    
    // If code is not available, try to match from the province name
    const name = geo.properties.name || "";
    for (const [code, provinceName] of Object.entries(PROVINCE_CODES)) {
      if (name.includes(provinceName) || provinceName.includes(name)) {
        return code;
      }
    }
    
    // Fallback: extract abbreviation from name
    const nameParts = name.split(' ');
    if (nameParts.length > 0) {
      const lastPart = nameParts[nameParts.length - 1];
      if (lastPart.length <= 3) {
        return lastPart.toUpperCase();
      }
    }
    
    console.warn(`Could not determine province code for: ${name}`);
    return name.substring(0, 2).toUpperCase(); // Last resort fallback
  };

  // Handle province hover
  const handleMouseEnter = (event: React.MouseEvent, geo: any) => {
    const provinceCode = getProvinceCode(geo);
    const provinceName = PROVINCE_CODES[provinceCode] || geo.properties.name;
    const provinceData = provinces.find(p => p.province === provinceCode);

    let content = `${provinceName}`;
    if (provinceData) {
      content += `\nTotal Species: ${provinceData.totalSpecies}`;
    } else {
      content += "\nNo data available";
    }

    setTooltipContent(content);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
    setShowTooltip(true);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Handle province click
  const handleProvinceClick = (geo: any) => {
    const provinceCode = getProvinceCode(geo);
    const provinceName = PROVINCE_CODES[provinceCode] || geo.properties.name;
    
    console.log("Clicked province:", provinceCode, provinceName);
    
    if (onProvinceClick) {
      onProvinceClick(provinceCode, provinceName);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold hc:text-white">Loading map data...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Base map only shown if !HC and !CB and showBaseMap */}
      {showBaseMap && !isHighContrastMode && !isColorBlindMode && (
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundColor: '#d4e6f1', opacity: 0.4 }} />
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'url("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")', backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', opacity: 0.3 }} />
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #b3d9ff 0%, rgba(179, 217, 255, 0) 75%), radial-gradient(circle at 30% 50%, #b3d9ff 0%, rgba(179, 217, 255, 0) 75%)', opacity: 0.6 }} />
        </div>
      )}
      
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 450 }}
        width={width}
        height={height}
        className="relative z-10"
      >
        <ZoomableGroup center={[-97, 60]} zoom={0.6}>
          <Geographies geography={CANADA_GEO_URL}>
            {({ geographies }) =>
              geographies.map(geo => {
                const provinceCode = getProvinceCode(geo);
                const fill = getProvinceColor(provinceCode);
                const stroke = currentStroke;
                const hoverFill = currentHoverFill;
                const pressedFill = currentPressedFill;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: hoverFill },
                      pressed: { outline: "none", fill: pressedFill }
                    }}
                    onMouseEnter={(event) => handleMouseEnter(event, geo)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleProvinceClick(geo)}
                    // Full opacity unless base map shown in default mode
                    opacity={showBaseMap && !isHighContrastMode && !isColorBlindMode ? 0.85 : 1}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      
      {/* Tooltip styling uses HC classes */}
      {showTooltip && (
        <div
          className="absolute p-2 rounded shadow-md text-sm z-20 pointer-events-none bg-white hc:bg-black hc:text-white hc:border hc:border-gray-600"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y - 10,
            transform: 'translate(5px, -100%)',
            whiteSpace: 'pre-line'
          }}
        >
          {tooltipContent}
        </div>
      )}
      
      {/* Legend styling uses HC classes and currentScale */}
      <div className="flex items-center justify-center mt-2 relative z-10">
        <div className="flex space-x-1 items-center text-xs p-1 rounded bg-white bg-opacity-75 hc:bg-gray-900 hc:bg-opacity-90 hc:text-white">
          <div className="mr-1">Species Density:</div>
          {currentScale.map((color, i) => (
            <div 
              key={i} 
              className="w-6 h-3 border border-gray-400 hc:border-gray-600"
              style={{ backgroundColor: color }}
              title={`Level ${i+1}`}
            />
          ))}
          <div className="ml-1">Lower</div>
          <div className="mx-1">→</div>
          <div>Higher</div>
        </div>
      </div>
    </div>
  );
};

export default CanadaMap;
