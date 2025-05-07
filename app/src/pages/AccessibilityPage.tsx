import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { useAccessibility } from '../context/AccessibilityContext';

const AccessibilityPage: React.FC = () => {
  const { 
    isHighContrastMode, 
    toggleHighContrastMode, 
    isColorBlindMode, 
    toggleColorBlindMode 
  } = useAccessibility();

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 hc:text-white">Accessibility & Values</h1>
        <p className="text-lg text-gray-700 mb-8 hc:text-gray-300">
          This page outlines our commitment to creating an inclusive and accessible web experience, 
          alongside the core values that drive our project, including our dedication to environmental 
          awareness and alignment with global sustainability goals.
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 hc:bg-black hc:border hc:border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 hc:text-white">Our Commitment to Progressive Values and Accessibility</h2>
          <p className="text-gray-700 mb-4 hc:text-gray-300">
            We believe in the power of information and technology to foster positive change. 
            A core tenet of our work is the responsibility to build digital tools that are not only 
            informative but also accessible to the widest possible audience, regardless of ability or context. 
            This commitment extends to ensuring that our visualizations and data presentations are perceivable, 
            operable, understandable, and robust for all users. We strive to adhere to web accessibility 
            standards and continuously seek ways to improve the inclusivity of our platform.
          </p>
        </div>

        {/* Accessibility Settings Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 hc:bg-black hc:border hc:border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 hc:text-white">Accessibility Settings</h2>
          <p className="text-gray-700 mb-6 hc:text-gray-300">
            Use the settings below to adjust the visual presentation of this website to better suit your needs. 
            Changes will apply across all pages.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2 hc:text-white">Color Contrast Mode</h3>
              <p className="text-gray-700 mb-4 hc:text-gray-300">Enhance text and background contrast for better readability.</p>
              <button 
                onClick={toggleHighContrastMode}
                aria-pressed={isHighContrastMode}
                className={`mt-2 px-6 py-3 rounded-lg font-semibold text-white transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-500 dark:focus:ring-offset-black dark:focus:ring-gray-400
                  ${isHighContrastMode 
                    ? 'bg-black border border-yellow-400 text-yellow-400 hover:bg-gray-800 hover:border-yellow-500' 
                    : 'bg-theme-red hover:bg-red-700 hc:bg-black hc:text-yellow-400 hc:border hc:border-yellow-400 hc:hover:bg-gray-800 hc:hover:border-yellow-500 cb:bg-theme-beige cb:text-black'}`}
              >
                {isHighContrastMode ? 'High Contrast: ON' : 'High Contrast: OFF'}
              </button>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 hc:text-white">Color Blind Friendly Mode</h3>
              <p className="text-gray-700 mb-4 hc:text-gray-300">Adjust colors in charts and key elements to be more distinguishable.</p>
              <button 
                onClick={toggleColorBlindMode}
                aria-pressed={isColorBlindMode}
                className={`mt-2 px-6 py-3 rounded-lg font-semibold text-white transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-500 dark:focus:ring-offset-black dark:focus:ring-gray-400
                  ${isColorBlindMode 
                    ? 'bg-theme-beige text-black border border-gray-600' // Active color-blind state
                    : 'bg-theme-red hover:bg-red-700 hc:bg-black hc:text-yellow-400 hc:border hc:border-yellow-400 hc:hover:bg-gray-800 hc:hover:border-yellow-500 cb:bg-theme-beige cb:text-black'}`}
              >
                {isColorBlindMode ? 'Color Blind Mode: ON' : 'Color Blind Mode: OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* SDG Alignment Section */}
        <div className="bg-white p-6 rounded-lg shadow-md hc:bg-black hc:border hc:border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 hc:text-white">Alignment with Sustainable Development Goals (SDGs)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col items-center text-center">
              <img src="/sdg14.png" alt="SDG 14: Life Below Water" className="h-32 w-32 mb-4"/>
              <h3 className="text-xl font-semibold mb-2 hc:text-white">SDG 14: Life Below Water</h3>
              <p className="text-gray-700 hc:text-gray-300">
                This project directly supports SDG 14 by visualizing data related to aquatic species, 
                particularly fish populations in Canada. By highlighting trends, declines, and conservation statuses, 
                we aim to raise awareness about the importance of conserving and sustainably using marine and freshwater 
                resources and ecosystems. Understanding these trends is crucial for informing policies and actions 
                that protect life below water.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <img src="/sdg15.png" alt="SDG 15: Life On Land" className="h-32 w-32 mb-4"/>
              <h3 className="text-xl font-semibold mb-2 hc:text-white">SDG 15: Life On Land</h3>
              <p className="text-gray-700 hc:text-gray-300">
                Our focus on terrestrial vertebrate populations, such as mammals and birds, aligns with SDG 15. 
                The visualization of their population trends and risk statuses helps to underscore the challenges 
                faced by these species and the ecosystems they inhabit. This information can contribute to efforts 
                to protect, restore, and promote sustainable use of terrestrial ecosystems, manage forests sustainably, 
                combat desertification, and halt and reverse land degradation and biodiversity loss.
              </p>
            </div>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
};

export default AccessibilityPage; 