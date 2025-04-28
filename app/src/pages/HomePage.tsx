import React, { useState, useMemo, useCallback } from 'react';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import ComposedChart from '../components/charts/ComposedChart';
import PageWrapper from '../components/layout/PageWrapper';
import { useData } from '../context/DataContext';

const HomePage: React.FC = () => {
  const { csiTrends, statusOverTime, loading, error } = useData();
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
          <div className="text-xl font-semibold text-red-600">
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
        <p className="text-gray-600">
          This visualization shows the correlation between Canadian vertebrate population trends (CSI)
          and species conservation status (CAN-SAR) over time (1970-2018).
        </p>
      </div>

      {/* Taxonomic Group Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3 justify-center">
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors 
              ${activeGroup === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setActiveGroup('all')}
          >
            All Groups
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors 
              ${activeGroup === 'birds' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setActiveGroup('birds')}
          >
            Birds
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors 
              ${activeGroup === 'mammals' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setActiveGroup('mammals')}
          >
            Mammals
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors 
              ${activeGroup === 'fish' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setActiveGroup('fish')}
          >
            Fish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 mb-12">
        {/* CSI Trends Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Canadian Species Index (CSI) Trends</h2>
          <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
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
            />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>The Canadian Species Index shows population trends for vertebrate species from 1970-2018.</p>
            <p>Note the declining trends for mammals and fish populations, while birds show more stability.</p>
          </div>
        </div>

        {/* SARA Status Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Species at Risk Status Distribution</h2>
          <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
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
            />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>This chart shows the distribution of species by SARA status over time.</p>
            <p>The data reveals increasing numbers of species being added to the at-risk categories.</p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default HomePage;
