import React from 'react';
import { useData } from '../../context/DataContext';
import BarChart from '../charts/BarChart';

interface ProvincePanelProps {
  provinceCode: string;
  provinceName: string;
  onClose: () => void;
}

const ProvincePanel: React.FC<ProvincePanelProps> = ({
  provinceCode,
  provinceName,
  onClose,
}) => {
  const { provinces, loading } = useData();
  
  // Find the province data
  const provinceData = provinces.find(p => p.province === provinceCode);

  if (loading) {
    return (
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Loading...</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
            aria-label="Close panel"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  if (!provinceData) {
    return (
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{provinceName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
            aria-label="Close panel"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>
        <div className="text-red-500">No data available for this province</div>
      </div>
    );
  }

  // Prepare data for the conservation actions chart
  const actionData = provinceData.dominantActions.map((action, index) => ({
    action,
    count: 100 - index * 15, // Mock counts for visualization
  }));

  // Status data
  const statusData = [
    { status: 'Endangered', count: provinceData.endangered },
    { status: 'Threatened', count: provinceData.threatened },
    { status: 'Special Concern', count: provinceData.special_concern },
  ];

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-6 overflow-y-auto z-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{provinceName}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-1"
          aria-label="Close panel"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Species Summary</h3>
        <div className="flex justify-between bg-gray-100 p-3 rounded-md mb-2">
          <span>Total Species:</span>
          <span className="font-semibold">{provinceData.totalSpecies}</span>
        </div>
        <div className="mb-4">
          <h4 className="text-md font-medium mb-2">Status Breakdown</h4>
          <div className="space-y-1">
            <div className="flex justify-between bg-red-100 p-2 rounded">
              <span>Endangered:</span>
              <span className="font-semibold">{provinceData.endangered}</span>
            </div>
            <div className="flex justify-between bg-orange-100 p-2 rounded">
              <span>Threatened:</span>
              <span className="font-semibold">{provinceData.threatened}</span>
            </div>
            <div className="flex justify-between bg-yellow-100 p-2 rounded">
              <span>Special Concern:</span>
              <span className="font-semibold">{provinceData.special_concern}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Status Distribution</h3>
        <BarChart
          data={statusData}
          bars={[
            { dataKey: 'count', name: 'Count', color: '#FF6B6B' },
          ]}
          xAxisDataKey="status"
          height={200}
          rotateLabels={true}
          showLabels={true}
        />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Representative Species</h3>
        <ul className="list-disc pl-5 space-y-1">
          {provinceData.representativeSpecies.map((species, index) => (
            <li key={index} className="text-gray-700">{species}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Dominant Conservation Actions</h3>
        <BarChart
          data={actionData}
          bars={[
            { dataKey: 'count', name: 'Priority', color: '#4ECDC4' },
          ]}
          xAxisDataKey="action"
          height={200}
          rotateLabels={true}
        />
        <div className="text-xs text-gray-500 italic mt-1">
          * Actions shown by relative importance
        </div>
      </div>
    </div>
  );
};

export default ProvincePanel;
