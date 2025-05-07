import React, { createContext, useContext, useState, useEffect } from 'react';

// Type definitions for our data
interface CSITrend {
  year: number;
  national: number;
  birds: number;
  mammals: number;
  fish: number;
}

interface StatusOverTime {
  year: number;
  group: string;
  status: string;
  count: number;
}

interface Province {
  province: string;
  provinceName: string;
  totalSpecies: number;
  representativeSpecies: string[];
  dominantActions: string[];
  endangered: number;
  special_concern: number;
  threatened: number;
}

interface Threat {
  threat: string;
  threatCode: string;
  count: number;
  percentage: number;
  avgImpact: number;
}

interface SpeciesDetails {
  id: string;
  name: string;
  scientificName: string;
  taxonomicGroup: string;
  status: string;
  endemic: {
    canada: boolean;
    northAmerica: boolean;
  };
  provinces: string[];
  threats: any[];
  actions: string[];
}

interface DataContextType {
  csiTrends: CSITrend[];
  statusOverTime: StatusOverTime[];
  provinces: Province[];
  threats: Threat[];
  speciesDetails: SpeciesDetails[];
  loading: boolean;
  error: Error | null;
}

// Create the context with a default value
const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider component
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<DataContextType>({
    csiTrends: [],
    statusOverTime: [],
    provinces: [],
    threats: [],
    speciesDetails: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [csiTrends, statusOverTime, provinces, threats, speciesDetails] = await Promise.all([
          fetch('/data/csi_trends.json').then(res => res.json()),
          fetch('/data/cansar_status_over_time.json').then(res => res.json()),
          fetch('/data/cansar_summary_by_province.json').then(res => res.json()),
          fetch('/data/cansar_threat_summary.json').then(res => res.json()),
          fetch('/data/cansar_species_details.json').then(res => res.json()),
        ]);

        setData({
          csiTrends,
          statusOverTime,
          provinces,
          threats,
          speciesDetails,
          loading: false,
          error: null,
        });
      } catch (error) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error : new Error('Unknown error occurred'),
        }));
      }
    };

    fetchData();
  }, []);

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

// Custom hook to use the data context
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
