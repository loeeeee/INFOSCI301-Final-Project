import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';

const ReferencesPage: React.FC = () => {
  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 hc:text-white">References & Acknowledgements</h1>
        <p className="text-gray-600 hc:text-gray-300">
          Data sources, references, and acknowledgements for the Canadian Species Data Visualization project.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8 hc:bg-black hc:border hc:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 hc:text-white">Data Sources</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg hc:text-white">Canadian Provinces GeoJSON</h3>
            <p className="text-gray-700 hc:text-gray-300">
              The GeoJSON data for Canadian provinces and territories used in the interactive map visualization.
            </p>
            <p className="text-sm text-gray-600 mt-2 hc:text-gray-300">
              Source: <a href="https://github.com/Mahshadn/canadian_map" target="_blank" rel="noopener noreferrer" className="text-theme-red hover:underline hc:text-yellow-300 hc:hover:underline cb:text-black cb:hover:underline">Mahshadn/canadian_map</a> on GitHub
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg hc:text-white">Canadian Species Index (CSI)</h3>
            <p className="text-gray-700 hc:text-gray-300">
              The Canadian Species Index data tracks population trends for Canadian vertebrate species from 1970-2018.
              The index is based on methodology developed by the World Wildlife Fund (WWF) and the Zoological Society of London (ZSL).
            </p>
            <p className="text-sm text-gray-600 mt-2 hc:text-gray-300">
              Source: Environment and Climate Change Canada (ECCC)
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg hc:text-white">CAN-SAR Database</h3>
            <p className="text-gray-700 hc:text-gray-300">
              The Canadian Species at Risk (CAN-SAR) database contains detailed information about species listed under
              the Species at Risk Act (SARA), including conservation status, geographic distribution, threats, and conservation actions.
            </p>
            <p className="text-sm text-gray-600 mt-2 hc:text-gray-300">
              Source: Committee on the Status of Endangered Wildlife in Canada (COSEWIC) and the Species at Risk Public Registry
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8 hc:bg-black hc:border hc:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 hc:text-white">Methodology</h2>
        <p className="text-gray-700 mb-4 hc:text-gray-300">
          The visualizations in this application are based on processed data from the CSI and CAN-SAR datasets.
          The data preprocessing involved:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 hc:text-gray-300">
          <li>Cleaning and standardizing data formats and taxonomic groups</li>
          <li>Filtering data to the 1970-2018 time period</li>
          <li>Calculating summary statistics by province, taxonomic group, and threat category</li>
          <li>Aggregating conservation status information over time</li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md hc:bg-black hc:border hc:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 hc:text-white">Acknowledgements</h2>
        <p className="text-gray-700 mb-4 hc:text-gray-300">
          This project was developed to visualize trends in Canadian species populations and conservation status.
          We would like to acknowledge the following organizations and individuals:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 hc:text-gray-300">
          <li>Environment and Climate Change Canada (ECCC) for the Canadian Species Index data</li>
          <li>The Committee on the Status of Endangered Wildlife in Canada (COSEWIC) for species assessments</li>
          <li>The Species at Risk Public Registry for conservation status information</li>
          <li>Professor Luyao (Sunshine) Zhang's invaluable guidance during the INFOSCI 301 course at Duke Kunshan University.</li>
          <li>Professors David Schaaf and Dongping Liu for their inspiring guest lectures</li>
          <li>All researchers and field workers who collected the underlying population data</li>
        </ul>
      </div>
    </PageWrapper>
  );
};

export default ReferencesPage;
