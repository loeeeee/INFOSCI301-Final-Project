import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Canadian Species Data Visualization
        </Link>
        <nav aria-label="Main navigation">
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-blue-200">
                Home
              </Link>
            </li>
            <li>
              <Link to="/findings" className="hover:text-blue-200">
                Findings
              </Link>
            </li>
            <li>
              <Link to="/map" className="hover:text-blue-200">
                Provincial Map
              </Link>
            </li>
            <li>
              <Link to="/importance" className="hover:text-blue-200">
                Importance
              </Link>
            </li>
            <li>
              <Link to="/references" className="hover:text-blue-200">
                References
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
