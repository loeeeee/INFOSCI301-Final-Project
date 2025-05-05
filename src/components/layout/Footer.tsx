import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Canadian Species Data Visualization
            </p>
          </div>
          <div>
            <p className="text-sm">
              Data sources: Canadian Species Index (CSI) and CAN-SAR database
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
