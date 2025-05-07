import React, { useState, useCallback } from 'react';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import PageWrapper from '../components/layout/PageWrapper';
import { useData } from '../context/DataContext';
import { useAccessibility } from '../context/AccessibilityContext';

const HomePage: React.FC = () => {
  const { csiTrends, statusOverTime, loading, error } = useData();
  const { isHighContrastMode, isColorBlindMode } = useAccessibility();
  const [activeGroup, setActiveGroup] = useState<string>('all');

  // Function to prepare status data for the bar chart
  const prepareStatusData = useCallback(() => {
    // If no data, return empty array
    if (!statusOverTime || statusOverTime.length === 0) return [];

    // Get all unique years
    const years = Array.from(new Set(statusOverTime.map(item => item.year))).sort();
    
    // Aggregate data by year and status
    const aggregatedData: Record<number, Record<string, number>> = {};
    
    // Initialize data structure
    years.forEach(year => {
      aggregatedData[year] = {
        year,
        endangered: 0,
        threatened: 0,
        special_concern: 0
      };
    });

    // Fill in the data
    statusOverTime.forEach(item => {
      // Only process data for the active group or all groups
      if (activeGroup !== 'all' && item.group.toLowerCase() !== activeGroup.toLowerCase()) {
        return;
      }

      const status = item.status.toLowerCase();
      
      if (status.includes('endangered')) {
        aggregatedData[item.year].endangered += item.count;
      } else if (status.includes('threatened')) {
        aggregatedData[item.year].threatened += item.count;
      } else if (status.includes('special concern')) {
        aggregatedData[item.year].special_concern += item.count;
      }
    });

    // Convert to array
    return Object.values(aggregatedData);
  }, [statusOverTime, activeGroup]);

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

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Population Trends vs. Conservation Status</h1>
        <p className="text-gray-600 hc:text-gray-300">
          This visualization shows the correlation between Canadian vertebrate population trends (CSI)
          and species conservation status (CAN-SAR) over time (1970-2018).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 mb-12">
        {/* CSI Trends Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md hc:bg-black hc:border hc:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Canadian Species Index (CSI) Trends</h2>
          <div className="border border-gray-200 rounded-md p-4 bg-gray-50 hc:bg-gray-900 hc:border-gray-700">
            <LineChart
              data={csiTrends as any[]}
              lines={[
                { key: 'national', name: 'National', color: '#4F46E5' },
                { key: 'birds', name: 'Birds', color: '#10B981' },
                { key: 'mammals', name: 'Mammals', color: '#F59E0B' },
                { key: 'fish', name: 'Fish', color: '#3B82F6' }
              ]}
              yAxisLabel="Index (1970 = 0)"
              yAxisDomain={[-100, 100]}
              isHighContrastMode={isHighContrastMode}
              isColorBlindMode={isColorBlindMode}
            />
          </div>
          <div className="mt-4 text-sm text-gray-600 hc:text-gray-300">
            <p>The Canadian Species Index shows population trends for vertebrate species from 1970-2018.</p>
            <p>Note the declining trends for mammals and fish populations, while birds show more stability.</p>
          </div>
        </div>

        {/* Taxonomic Group Filter */}
        <div className="my-6">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setActiveGroup('all')}
              className={`px-4 py-2 rounded-lg transition-colors duration-150 ease-in-out
                          ${activeGroup === 'all' ? 
                            'bg-theme-red text-white hc:bg-yellow-400 hc:text-black hc:border hc:border-yellow-600 cb:bg-theme-beige cb:text-black' : 
                            'bg-gray-200 hover:bg-gray-300 hc:bg-gray-700 hc:text-white hc:hover:bg-gray-600'}`}
            >
              All Vertebrates
            </button>
            <button
              onClick={() => setActiveGroup('birds')}
              className={`px-4 py-2 rounded-lg transition-colors duration-150 ease-in-out
                          ${activeGroup === 'birds' ? 
                            'bg-theme-red text-white hc:bg-yellow-400 hc:text-black hc:border hc:border-yellow-600 cb:bg-theme-beige cb:text-black' : 
                            'bg-gray-200 hover:bg-gray-300 hc:bg-gray-700 hc:text-white hc:hover:bg-gray-600'}`}
            >
              Birds
            </button>
            <button
              onClick={() => setActiveGroup('mammals')}
              className={`px-4 py-2 rounded-lg transition-colors duration-150 ease-in-out
                          ${activeGroup === 'mammals' ? 
                            'bg-theme-red text-white hc:bg-yellow-400 hc:text-black hc:border hc:border-yellow-600 cb:bg-theme-beige cb:text-black' : 
                            'bg-gray-200 hover:bg-gray-300 hc:bg-gray-700 hc:text-white hc:hover:bg-gray-600'}`}
            >
              Mammals
            </button>
            <button
              onClick={() => setActiveGroup('fish')}
              className={`px-4 py-2 rounded-lg transition-colors duration-150 ease-in-out
                          ${activeGroup === 'fish' ? 
                            'bg-theme-red text-white hc:bg-yellow-400 hc:text-black hc:border hc:border-yellow-600 cb:bg-theme-beige cb:text-black' : 
                            'bg-gray-200 hover:bg-gray-300 hc:bg-gray-700 hc:text-white hc:hover:bg-gray-600'}`}
            >
              Fish
            </button>
          </div>
        </div>

        {/* SARA Status Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md hc:bg-black hc:border hc:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Species at Risk Status Distribution</h2>
          <div className="border border-gray-200 rounded-md p-4 bg-gray-50 hc:bg-gray-900 hc:border-gray-700">
            <BarChart
              data={prepareStatusData()}
              bars={[
                { dataKey: 'endangered', name: 'Endangered', color: '#EF4444' },
                { dataKey: 'threatened', name: 'Threatened', color: '#F59E0B' },
                { dataKey: 'special_concern', name: 'Special Concern', color: '#FBBF24' }
              ]}
              xAxisDataKey="year"
              xAxisLabel="Year"
              yAxisLabel="Number of Species"
              stacked={true}
              isHighContrastMode={isHighContrastMode}
              isColorBlindMode={isColorBlindMode}
            />
          </div>
          <div className="mt-4 text-sm text-gray-600 hc:text-gray-300">
            <p>This chart shows the distribution of species by SARA status over time.</p>
            <p>The data reveals increasing numbers of species being added to the at-risk categories.</p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default HomePage;
