import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  // Define the navigation paths in order
  const paths = ["/", "/findings", "/map", "/importance", "/references"];
  
  // Get current path index
  const currentIndex = paths.indexOf(location.pathname);
  
  // Determine next and previous paths
  const prevPath = currentIndex > 0 ? paths[currentIndex - 1] : null;
  const nextPath = currentIndex < paths.length - 1 ? paths[currentIndex + 1] : null;
  
  return (
    <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-200">
      {prevPath ? (
        <Link
          to={prevPath}
          className="flex items-center px-4 py-2 bg-theme-red text-white rounded-md hover:bg-red-700 transition-colors hc:bg-gray-700 hc:text-white hc:hover:bg-gray-600 hc:border hc:border-gray-500 cb:bg-theme-beige cb:text-black cb:hover:border cb:hover:border-black"
        >
          <FaArrowLeft className="mr-2" />
          Previous: {prevPath === '/' ? 'Home' : prevPath.charAt(1).toUpperCase() + prevPath.slice(2)}
        </Link>
      ) : (
        <div></div>
      )}
      
      {nextPath ? (
        <Link
          to={nextPath}
          className="flex items-center px-4 py-2 bg-theme-red text-white rounded-md hover:bg-red-700 transition-colors hc:bg-gray-700 hc:text-white hc:hover:bg-gray-600 hc:border hc:border-gray-500 cb:bg-theme-beige cb:text-black cb:hover:border cb:hover:border-black"
        >
          Next: {nextPath === '/' ? 'Home' : nextPath.charAt(1).toUpperCase() + nextPath.slice(2)}
          <FaArrowRight className="ml-2" />
        </Link>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Navigation;
