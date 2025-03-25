import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext'; // Correct import path

const Navbar = () => {
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Ref for the dropdown menu

  // Use AuthContext for authentication state
  const { isAuthenticated, logout } = useContext(AuthContext);

  // Handle profile click
  const handleProfileClick = () => {
    navigate('/profile');
    setIsDropdownOpen(false); // Close dropdown
  };

  // Handle logout click
  const handleLogoutClick = () => {
    logout(); // Call logout handler
    navigate('/'); // Redirect to home page
    setIsDropdownOpen(false); // Close dropdown
  };

  // Handle navigation to protected routes (e.g., Study Rooms, Achievements)
  // const handleProtectedNavigation = (path) => {
  //   if (isAuthenticated) {
  //     navigate(path); // Navigate to the protected route
  //   } else {
  //     navigate('/signin'); // Redirect to Sign-In page
  //   }
  // };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // Close dropdown
      }
    };

    // Add event listener for clicks outside the dropdown
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-green-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Side: Logo and Links */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-bold">
            Study Buddy
          </Link>
        </div>

        {/* Right Side: Authentication Links or Profile Icon */}
        <div className="relative" ref={dropdownRef}>
          {isAuthenticated ? (
            <>
              {/* Profile Icon */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center focus:outline-none"
              >
                <i className="fas fa-user-circle text-2xl"></i>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
                  <button
                    onClick={handleProfileClick}
                    className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-100 text-left"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-100 text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Sign In and Sign Up Links */
            <div className="flex space-x-4">
              <Link to="/signin" className="hover:underline">
                Sign In
              </Link>
              <Link to="/signup" className="hover:underline">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;