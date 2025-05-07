import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-theme-red text-white shadow-md hc:bg-black cb:bg-theme-beige cb:text-black">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-12 w-12 mr-3 rounded-full bg-white hc:bg-white hc:border hc:border-white"
          />
          <Link to="/" className="text-2xl font-bold hc:text-white cb:text-black">
            Canadian Vertebrate Species at Risk Visualization
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-red-200 hc:hover:text-yellow-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/findings" className="hover:text-red-200 hc:hover:text-yellow-300">
                Findings
              </Link>
            </li>
            <li>
              <Link to="/map" className="hover:text-red-200 hc:hover:text-yellow-300">
                Provincial Map
              </Link>
            </li>
            <li>
              <Link to="/importance" className="hover:text-red-200 hc:hover:text-yellow-300">
                Importance
              </Link>
            </li>
            <li>
              <Link to="/references" className="hover:text-red-200 hc:hover:text-yellow-300">
                References
              </Link>
            </li>
            <li>
              <Link to="/accessibility" className="hover:text-red-200 hc:hover:text-yellow-300">
                Accessibility & Values
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
