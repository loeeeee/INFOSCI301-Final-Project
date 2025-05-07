import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AccessibilityContextType {
  isHighContrastMode: boolean;
  toggleHighContrastMode: () => void;
  isColorBlindMode: boolean;
  toggleColorBlindMode: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isHighContrastMode, setIsHighContrastMode] = useState(false);
  const [isColorBlindMode, setIsColorBlindMode] = useState(false);

  const toggleHighContrastMode = () => {
    setIsHighContrastMode(prev => {
      const newState = !prev;
      if (newState) {
        setIsColorBlindMode(false); // Ensure color blind mode is off
      }
      return newState;
    });
  };

  const toggleColorBlindMode = () => {
    setIsColorBlindMode(prev => {
      const newState = !prev;
      if (newState) {
        setIsHighContrastMode(false); // Ensure high contrast mode is off
      }
      return newState;
    });
  };

  return (
    <AccessibilityContext.Provider value={{
      isHighContrastMode,
      toggleHighContrastMode,
      isColorBlindMode,
      toggleColorBlindMode
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}; 