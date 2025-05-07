import React, { useState, useMemo } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { useData } from '../context/DataContext';
import CanadaMap from '../components/map/CanadaMap';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';
import { useAccessibility } from '../context/AccessibilityContext';

// Create the national summary data by aggregating information from all provinces
const createNationalSummary = (provinces: any[]) => {
  if (!provinces || provinces.length === 0) return null;
  
  const totalSpecies = provinces.reduce((sum, province) => sum + province.totalSpecies, 0);
  const endangered = provinces.reduce((sum, province) => sum + province.endangered, 0);
  const threatened = provinces.reduce((sum, province) => sum + province.threatened, 0);
  const special_concern = provinces.reduce((sum, province) => sum + province.special_concern, 0);
  
  // Get all unique representative species across provinces
  const allSpecies = new Set<string>();
  provinces.forEach(province => {
    province.representativeSpecies.forEach((species: string) => {
      allSpecies.add(species);
    });
  });
  
  // Take up to 6 representative species for the national summary
  const representativeSpecies = Array.from(allSpecies).slice(0, 6);
  
  return {
    provinceName: "Canada (National Summary)",
    totalSpecies,
    endangered,
    threatened,
    special_concern,
    representativeSpecies
  };
};

// Province details panel displayed to the right of the map
const ProvinceDetails: React.FC<{ province: any, isHighContrastMode?: boolean, isColorBlindMode?: boolean }> = ({ province, isHighContrastMode = false, isColorBlindMode = false }) => {
  if (!province) return null;

  // Status data for bar chart
  const statusData = [
    { status: 'Endangered', count: province.endangered },
    { status: 'Threatened', count: province.threatened },
    { status: 'Special Concern', count: province.special_concern },
  ];

  // Status data for pie chart
  const statusPieData = [
    { name: 'Endangered', value: province.endangered },
    { name: 'Threatened', value: province.threatened },
    { name: 'Special Concern', value: province.special_concern },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full hc:bg-black hc:border hc:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold hc:text-white">{province.provinceName}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-3 rounded hc:bg-gray-900 hc:border hc:border-gray-700 cb:bg-theme-beige cb:bg-opacity-60">
          <span className="block text-3xl font-bold hc:text-white cb:text-black">{province.totalSpecies}</span>
          <span className="text-sm text-gray-600 hc:text-gray-300 cb:text-gray-700">Total Species at Risk</span>
        </div>
        <div className="bg-red-50 p-3 rounded hc:bg-gray-900 hc:border hc:border-gray-700 cb:bg-theme-beige cb:bg-opacity-60">
          <span className="block text-3xl font-bold text-red-700 hc:text-yellow-400 cb:text-black">{province.endangered}</span>
          <span className="text-sm text-gray-600 hc:text-gray-300 cb:text-gray-700">Endangered</span>
        </div>
        <div className="bg-amber-50 p-3 rounded hc:bg-gray-900 hc:border hc:border-gray-700 cb:bg-theme-beige cb:bg-opacity-60">
          <span className="block text-3xl font-bold text-amber-700 hc:text-cyan-400 cb:text-black">{province.threatened}</span>
          <span className="text-sm text-gray-600 hc:text-gray-300 cb:text-gray-700">Threatened</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-50 p-4 rounded hc:bg-gray-900 hc:border hc:border-gray-700">
          <h3 className="text-lg font-semibold mb-3 hc:text-white">Status Distribution</h3>
          <BarChart
            data={statusData}
            bars={[
              { dataKey: 'count', name: 'Count', color: '#FF6B6B' },
            ]}
            xAxisDataKey="status"
            height={240}
            rotateLabels={true}
            showLabels={true}
            isHighContrastMode={isHighContrastMode}
            isColorBlindMode={isColorBlindMode}
          />
        </div>

        <div className="bg-gray-50 p-4 rounded hc:bg-gray-900 hc:border hc:border-gray-700">
          <h3 className="text-lg font-semibold mb-3 hc:text-white">Status Proportion</h3>
          <div className="h-[240px] flex justify-center items-center">
            <PieChart
              data={statusPieData}
              dataKey="value"
              nameKey="name"
              height={240}
              outerRadius={80}
              showLegend={false}
              isHighContrastMode={isHighContrastMode}
              isColorBlindMode={isColorBlindMode}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-gray-50 p-4 rounded hc:bg-gray-900 hc:border hc:border-gray-700">
        <h3 className="text-lg font-semibold mb-3 hc:text-white">Representative Species</h3>
        <ul className="list-disc pl-5 space-y-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4">
          {province.representativeSpecies.map((species: string, index: number) => (
            <li key={index} className="text-gray-700 hc:text-gray-300">{species}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const MapPage: React.FC = () => {
  const { provinces, loading, error } = useData();
  const { isHighContrastMode, isColorBlindMode } = useAccessibility();
  const [selectedProvince, setSelectedProvince] = useState<{code: string, name: string} | null>(null);

  // Generate the national summary data
  const nationalSummary = useMemo(() => {
    return createNationalSummary(provinces);
  }, [provinces]);

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl font-semibold">Loading data...</div>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl font-semibold text-red-600 hc:text-yellow-400">
            Error loading data: {error.message}
          </div>
        </div>
      </PageWrapper>
    );
  }

  const handleProvinceClick = (provinceCode: string, provinceName: string) => {
    // If clicking the same province again, deselect it
    if (selectedProvince && selectedProvince.code === provinceCode) {
      setSelectedProvince(null);
    } else {
      setSelectedProvince({code: provinceCode, name: provinceName});
      console.log('Selected province:', provinceCode);
    }
  };

  const getProvinceData = () => {
    if (!selectedProvince) return null;
    
    // Find the province in the provinces array
    const province = provinces.find(p => p.province === selectedProvince.code);
    
    if (!province) {
      console.error(`Province data not found for code: ${selectedProvince.code}`);
      return null;
    }
    
    return province;
  };

  const provinceData = getProvinceData();

  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 hc:text-white">Provincial Conservation Overview</h1>
        <p className="text-gray-600 mb-4 hc:text-gray-300">
          Explore species at risk data across Canadian provinces and territories.
          Click on a province to see detailed information about species at risk and their status in that region.
          The national summary is shown by default.
        </p>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Map Container */}
          <div className="bg-white p-4 rounded-lg shadow-md md:w-1/2 hc:bg-black hc:border hc:border-gray-700">
            <CanadaMap 
              onProvinceClick={handleProvinceClick}
              width={500} 
              height={500}
              showBaseMap={true}
              isHighContrastMode={isHighContrastMode}
              isColorBlindMode={isColorBlindMode}
            />
          </div>

          {/* Information Panel */}
          <div className="md:w-1/2">
            {provinceData && <ProvinceDetails province={provinceData} isHighContrastMode={isHighContrastMode} isColorBlindMode={isColorBlindMode} />}
            {selectedProvince && !provinceData && (
              <div className="bg-white p-6 rounded-lg shadow-md h-full hc:bg-black hc:border hc:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold hc:text-white">{selectedProvince.name}</h2>
                </div>
                <div className="text-red-500 hc:text-yellow-400">No data available for this province</div>
                <div className="mt-2 text-gray-600 hc:text-gray-300">
                  Debug info: Looking for province code "{selectedProvince.code}" in {provinces.length} provinces
                </div>
              </div>
            )}
            {!selectedProvince && nationalSummary && (
              <ProvinceDetails province={nationalSummary} isHighContrastMode={isHighContrastMode} isColorBlindMode={isColorBlindMode} />
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default MapPage;
