import React from 'react';
// Link import might be unused now, can be removed if no other links remain.
// import { Link } from 'react-router-dom'; 

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 hc:bg-black">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Canadian Vertebrate Species at Risk Visualization
            </p>
          </div>
          <div> {/* Reverted to simple div if only one p tag remains */}
            <p className="text-sm">
              Data sources: Canadian Species Index (CSI) and CAN-SAR database
            </p>
            {/* Accessibility Link Removed */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
