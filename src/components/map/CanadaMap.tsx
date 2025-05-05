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

// Color scale for the map
const COLOR_SCALE = [
  "#edf8fb",
  "#ccece6",
  "#99d8c9",
  "#66c2a4",
  "#41ae76",
  "#238b45",
  "#005824"
];

// A colorblind-friendly sequential color scale (Viridis-like)
const COLORBLIND_FRIENDLY_COLOR_SCALE = [
  "#fde725",
  "#b5de2b",
  "#6dcd59",
  "#35b779",
  "#1f9e89",
  "#26828e",
  "#31688e",
  "#3e4e8c",
  "#482878",
  "#440154"
];

interface CanadaMapProps {
  onProvinceClick?: (province: string, provinceName: string) => void;
  width?: number;
  height?: number;
  showBaseMap?: boolean;
}

const CanadaMap: React.FC<CanadaMapProps> = ({ 
  onProvinceClick,
  width = 800,
  height = 500,
  showBaseMap = false
}) => {
  const { provinces, loading } = useData();
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  // Function to determine province color based on species count
  const getProvinceColor = (provinceCode: string) => {
    if (!provinces.length) return COLORBLIND_FRIENDLY_COLOR_SCALE[0];
    
    const provinceData = provinces.find(p => p.province === provinceCode);
    
    if (!provinceData) return "#F5F5F5"; // Light gray for no data
    
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
      Math.floor(normalizedCount * COLORBLIND_FRIENDLY_COLOR_SCALE.length),
      COLORBLIND_FRIENDLY_COLOR_SCALE.length - 1
    );
    
    return COLORBLIND_FRIENDLY_COLOR_SCALE[colorIndex];
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
        <div className="text-xl font-semibold">Loading map data...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Base map layer with natural earth styling */}
      {showBaseMap && (
        <div className="absolute top-0 left-0 w-full h-full z-0">
          {/* Primary base map styling */}
          <div 
            className="absolute top-0 left-0 w-full h-full" 
            style={{ backgroundColor: '#d4e6f1', opacity: 0.4 }} 
          />
          
          {/* Overlay for terrain effect */}
          <div 
            className="absolute top-0 left-0 w-full h-full" 
            style={{ 
              backgroundImage: 'url("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: 0.3
            }} 
          />
          
          {/* Water texture */}
          <div 
            className="absolute top-0 left-0 w-full h-full" 
            style={{ 
              backgroundImage: 'radial-gradient(circle at 70% 50%, #b3d9ff 0%, rgba(179, 217, 255, 0) 75%), radial-gradient(circle at 30% 50%, #b3d9ff 0%, rgba(179, 217, 255, 0) 75%)',
              opacity: 0.6
            }} 
          />
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
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getProvinceColor(provinceCode)}
                    stroke="#FFFFFF"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: "#FFD700" },
                      pressed: { outline: "none", fill: "#E42" }
                    }}
                    onMouseEnter={(event) => handleMouseEnter(event, geo)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleProvinceClick(geo)}
                    // Add some opacity to see the base map underneath if it's enabled
                    opacity={showBaseMap ? 0.85 : 1}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      
      {/* Fixed tooltip positioning to work better with the viewport */}
      {showTooltip && (
        <div
          className="absolute bg-white p-2 rounded shadow-md text-sm z-20 pointer-events-none"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y - 40,
            transform: 'translate(0, -100%)',
            whiteSpace: 'pre-line'
          }}
        >
          {tooltipContent}
        </div>
      )}
      
      {/* Color Legend */}
      <div className="flex items-center justify-center mt-2 relative z-10">
        <div className="flex space-x-1 items-center text-xs bg-white bg-opacity-75 p-1 rounded">
          <div className="mr-1">Species Density:</div>
          {COLORBLIND_FRIENDLY_COLOR_SCALE.map((color, i) => (
            <div 
              key={i} 
              className="w-6 h-3"
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
