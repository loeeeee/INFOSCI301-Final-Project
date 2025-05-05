import React from 'react';
import { useLocation, Link } from 'react-router-dom';

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
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            aria-hidden="true" // Hide decorative icon from screen readers
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Previous
        </Link>
      ) : (
        <div></div>
      )}
      
      {nextPath ? (
        <Link
          to={nextPath}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Next
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-2"
            aria-hidden="true" // Hide decorative icon from screen readers
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Navigation;
