import React from 'react';
import LineChart from '../components/charts/LineChart';
import PageWrapper from '../components/layout/PageWrapper';
import { useData } from '../context/DataContext';
import { useAccessibility } from '../context/AccessibilityContext';

const ImportancePage: React.FC = () => {
  const { csiTrends, loading, error } = useData();
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

  // Calculate the overall decline from the data
  const getDeclinePercentage = (data: typeof csiTrends, animal: 'mammals' | 'fish' | 'birds') => {
    if (data.length === 0) return "0";
    
    const firstYear = data[0];
    const lastYear = data[data.length - 1];
    
    return Math.abs(lastYear[animal] - firstYear[animal]).toFixed(1);
  };

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 hc:text-white">The Importance of Conservation</h1>
        <p className="text-gray-600 hc:text-gray-300">
          Understanding the impact of population declines and the urgency of conservation efforts.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8 hc:bg-black hc:border hc:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 hc:text-white">Population Decline Trends</h2>
        <div className="border border-gray-200 rounded-md p-4 bg-gray-50 hc:bg-gray-900 hc:border-gray-700">
          <LineChart
            data={csiTrends as any[]}
            lines={[
              { key: 'mammals', name: 'Mammals', color: '#EF4444', strokeWidth: 3 },
              { key: 'fish', name: 'Fish', color: '#d84830', strokeWidth: 3 },
              { key: 'birds', name: 'Birds', color: '#10B981', strokeWidth: 3 }
            ]}
            yAxisLabel="Index (1970 = 0)"
            yAxisDomain={[-100, 100]}
            title="Population Trends (1970-2018)"
            isHighContrastMode={isHighContrastMode}
            isColorBlindMode={isColorBlindMode}
          />
        </div>
        
        <div className="mt-6 text-lg">
          <p className="mb-4 hc:text-gray-300">
            Since 1970, Canadian vertebrate populations have been experiencing significant declines:
          </p>
          <ul className="space-y-3">
            <li className="flex items-center hc:text-white">
              <span className="inline-block w-4 h-4 mr-3 bg-red-500 rounded-full hc:bg-yellow-400 cb:bg-theme-beige"></span>
              <span><strong>Mammal populations</strong> have declined by approximately <strong className="text-red-600 hc:text-yellow-400 cb:text-black">{getDeclinePercentage(csiTrends, 'mammals')}%</strong></span>
            </li>
            <li className="flex items-center hc:text-white">
              <span className="inline-block w-4 h-4 mr-3 bg-theme-red rounded-full hc:bg-orange-400 cb:bg-theme-beige"></span>
              <span><strong>Fish populations</strong> have declined by approximately <strong className="text-red-600 hc:text-orange-400 cb:text-black">{getDeclinePercentage(csiTrends, 'fish')}%</strong></span>
            </li>
            <li className="flex items-center hc:text-white">
              <span className="inline-block w-4 h-4 mr-3 bg-green-500 rounded-full hc:bg-lime-400 cb:bg-theme-beige"></span>
              <span><strong>Bird populations</strong> have shown a change of approximately <strong className="text-green-600 hc:text-lime-400 cb:text-black">+{getDeclinePercentage(csiTrends, 'birds')}%</strong></span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8 hc:bg-black hc:border hc:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 hc:text-white">Why Conservation Matters</h2>
        <div className="prose max-w-none hc:[&_p]:text-gray-300 hc:[&_li]:text-gray-300">
          <p className="mb-4">
            Conservation of species is crucial for maintaining biodiversity and ecosystem health. Each species plays a unique role in its ecosystem, and the loss of even one can have cascading effects throughout the environment.
          </p>
          <p className="mb-4">
            The data presented in this visualization demonstrates the urgent need for conservation action. As human activities continue to impact natural habitats, many species face increasing threats to their survival.
          </p>
          <p>
            By understanding these trends and the factors driving them, we can develop more effective conservation strategies and policies to protect Canada's rich biodiversity for future generations.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md hc:bg-black hc:border hc:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 hc:text-white">Take Action</h2>
        <div className="prose max-w-none hc:[&_p]:text-gray-300 hc:[&_ul]:text-gray-300 hc:[&_li]:text-gray-300">
          <p className="mb-4">
            There are many ways individuals can contribute to conservation efforts:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Support conservation organizations and initiatives</li>
            <li>Advocate for policies that protect natural habitats</li>
            <li>Make sustainable choices in daily life</li>
            <li>Learn about and appreciate local biodiversity</li>
            <li>Participate in citizen science projects</li>
          </ul>
          <p>
            Together, we can make a difference in reversing these concerning trends and ensuring a sustainable future for all species.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ImportancePage;
