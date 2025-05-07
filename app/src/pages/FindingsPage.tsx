import React from 'react';
import PieChart from '../components/charts/PieChart';
import BarChart from '../components/charts/BarChart';
import PageWrapper from '../components/layout/PageWrapper';
import { useData } from '../context/DataContext';
import { useAccessibility } from '../context/AccessibilityContext';

const FindingsPage: React.FC = () => {
  const { speciesDetails, threats, loading, error } = useData();
  const { isHighContrastMode, isColorBlindMode } = useAccessibility();

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

  // Calculate data for key findings (placeholders for now)
  const endangeredCount = speciesDetails.filter(species => species.status === "Endangered").length;
  const threatenedCount = speciesDetails.filter(species => species.status === "Threatened").length;
  const specialConcernCount = speciesDetails.filter(species => species.status === "Special Concern").length;
  
  // Get top threats (sort by count and get top 5)
  const topThreats = [...threats].sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 hc:text-white">Key Findings</h1>
        <p className="text-gray-600 hc:text-gray-300">
          Summary of key statistics and findings from the CSI and CAN-SAR datasets.
        </p>
      </div>

      {/* Key statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-red-100 p-6 rounded-lg shadow hc:bg-black hc:border hc:border-gray-700 cb:bg-theme-beige cb:bg-opacity-60">
          <div className="text-4xl font-bold text-red-700 mb-2 hc:text-yellow-300 cb:text-black">{endangeredCount}</div>
          <div className="text-lg font-semibold hc:text-white cb:text-black">Endangered Species</div>
          <p className="text-sm text-gray-600 mt-2 hc:text-gray-300 cb:text-gray-700">Species facing imminent extinction or extirpation.</p>
        </div>
        
        <div className="bg-amber-100 p-6 rounded-lg shadow hc:bg-black hc:border hc:border-gray-700 cb:bg-theme-beige cb:bg-opacity-60">
          <div className="text-4xl font-bold text-amber-700 mb-2 hc:text-yellow-300 cb:text-black">{threatenedCount}</div>
          <div className="text-lg font-semibold hc:text-white cb:text-black">Threatened Species</div>
          <p className="text-sm text-gray-600 mt-2 hc:text-gray-300 cb:text-gray-700">Species likely to become endangered if nothing is done.</p>
        </div>
        
        <div className="bg-yellow-100 p-6 rounded-lg shadow hc:bg-black hc:border hc:border-gray-700 cb:bg-theme-beige cb:bg-opacity-60">
          <div className="text-4xl font-bold text-yellow-700 mb-2 hc:text-yellow-300 cb:text-black">{specialConcernCount}</div>
          <div className="text-lg font-semibold hc:text-white cb:text-black">Special Concern</div>
          <p className="text-sm text-gray-600 mt-2 hc:text-gray-300 cb:text-gray-700">Species that may become threatened or endangered.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* SARA Status Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md hc:bg-black hc:border hc:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 hc:text-white">SARA Status Distribution</h2>
          <div className="border border-gray-200 rounded-md p-4 bg-gray-50 hc:bg-gray-900 hc:border-gray-700">
            <PieChart
              data={[
                { name: 'Endangered', value: endangeredCount, color: '#EF4444' },
                { name: 'Threatened', value: threatenedCount, color: '#F59E0B' },
                { name: 'Special Concern', value: specialConcernCount, color: '#FBBF24' }
              ]}
              height={350}
              isHighContrastMode={isHighContrastMode}
              isColorBlindMode={isColorBlindMode}
            />
          </div>
        </div>

        {/* Top Threats Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md hc:bg-black hc:border hc:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 hc:text-white">Top Threats to Canadian Species</h2>
          <div className="border border-gray-200 rounded-md p-4 bg-gray-50 hc:bg-gray-900 hc:border-gray-700">
            <BarChart
              data={topThreats.map(threat => ({ ...threat }))}
              bars={[
                { dataKey: 'count', name: 'Number of Species Affected', color: '#3B82F6' }
              ]}
              xAxisDataKey="threat"
              yAxisLabel="Count"
              rotateLabels={true}
              height={350}
              showLabels={true}
              isHighContrastMode={isHighContrastMode}
              isColorBlindMode={isColorBlindMode}
            />
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-2 hc:text-white">Top 5 Threats:</h3>
            <ol className="list-decimal list-inside">
              {topThreats.map((threat, index) => (
                <li key={index} className="text-sm text-gray-700 mb-1 hc:text-gray-300">
                  {threat.threat} ({threat.percentage}% of species affected)
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default FindingsPage;
